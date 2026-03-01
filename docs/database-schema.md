# Trust_Lens — Database Schema

## 1. Overview

Trust_Lens uses **Firebase Firestore** (NoSQL document database) for data persistence. Firestore provides real-time synchronization (for the Trending Dashboard), serverless auto-scaling, and a generous free tier suitable for the MVP.

---

## 2. Database Architecture

```
Firestore (NoSQL, Document-Oriented)
│
├── 📁 Collection: verdicts
│   └── 📄 Document: {auto-id}
│       ├── claim (string)
│       ├── normalizedClaim (string)
│       ├── claimHash (string) — indexed
│       ├── verdict (string) — "verified" | "false" | "unverified"
│       ├── confidence (number) — 0.0 to 1.0
│       ├── explanation (string)
│       ├── sources (array of maps)
│       │   └── { title, url, domain }
│       ├── retrievedSnippets (array of strings)
│       ├── searchProvider (string) — "tavily" | "google_cse" | "both"
│       ├── processingTimeMs (number)
│       ├── cached (boolean) — whether served from cache
│       ├── createdAt (timestamp) — indexed
│       └── metadata (map)
│           ├── geminiModel (string)
│           ├── temperature (number)
│           └── promptVersion (string)
│
├── 📁 Collection: trending
│   └── 📄 Document: {auto-id}
│       ├── claim (string) — truncated to 150 chars
│       ├── verdict (string)
│       ├── confidence (number)
│       ├── createdAt (timestamp) — indexed, descending
│       └── verdictId (string) — reference to verdicts doc
│
├── 📁 Collection: analytics
│   └── 📄 Document: {date-string} — e.g., "2026-03-01"
│       ├── totalQueries (number)
│       ├── verifiedCount (number)
│       ├── falseCount (number)
│       ├── unverifiedCount (number)
│       ├── avgConfidence (number)
│       ├── avgProcessingTimeMs (number)
│       ├── topClaims (array of maps)
│       │   └── { claim, count }
│       └── updatedAt (timestamp)
│
└── 📁 Collection: systemConfig
    └── 📄 Document: "settings"
        ├── maxClaimLength (number) — 500
        ├── cacheTTLMinutes (number) — 60
        ├── rateLimitPerMinute (number) — 20
        ├── searchProviderPriority (array) — ["tavily", "google_cse"]
        ├── geminiModel (string) — "gemini-pro"
        ├── geminiTemperature (number) — 0.1
        └── updatedAt (timestamp)
```

---

## 3. Detailed Collection Schemas

### 3.1 `verdicts` Collection

The primary collection storing every fact-check query and its result.

```typescript
interface Verdict {
  // Core identifiers
  id: string;                  // Auto-generated Firestore document ID
  claimHash: string;           // SHA-256 of normalizedClaim (for cache lookup)

  // User input
  claim: string;               // Original claim text (max 500 chars)
  normalizedClaim: string;     // Lowercase, trimmed, punctuation-free

  // AI verdict
  verdict: "verified" | "false" | "unverified";
  confidence: number;          // 0.0 to 1.0
  explanation: string;         // 2-sentence plain-language summary

  // Sources
  sources: Source[];           // Official .gov.in documents used
  retrievedSnippets: string[]; // Raw text snippets from search results

  // Metadata
  searchProvider: "tavily" | "google_cse" | "both";
  processingTimeMs: number;    // End-to-end processing duration
  cached: boolean;             // Whether this was a cache hit
  createdAt: Timestamp;        // Firestore server timestamp

  metadata: {
    geminiModel: string;       // e.g., "gemini-pro"
    temperature: number;       // e.g., 0.1
    promptVersion: string;     // e.g., "v1.0"
  };
}

interface Source {
  title: string;               // Page title from search result
  url: string;                 // Full URL (must be .gov.in)
  domain: string;              // e.g., "pib.gov.in"
}
```

**Indexes:**

| Field            | Type       | Purpose                                 |
|------------------|------------|-----------------------------------------|
| `claimHash`      | Ascending  | Fast cache lookup by claim hash         |
| `createdAt`      | Descending | Trending dashboard (recent first)       |
| `verdict`        | Ascending  | Analytics filtering by verdict type     |
| `createdAt` + `verdict` | Composite | Filtered trending queries       |

---

### 3.2 `trending` Collection

A lightweight, denormalized collection optimized for real-time dashboard reads.

```typescript
interface TrendingItem {
  id: string;                  // Auto-generated
  claim: string;               // Truncated to 150 chars
  verdict: "verified" | "false" | "unverified";
  confidence: number;
  createdAt: Timestamp;        // Indexed, descending
  verdictId: string;           // Reference to full verdict document
}
```

**Why a separate collection?**
- Firestore charges per document read.
- The trending board reads frequently (real-time `onSnapshot`).
- Smaller documents = lower read costs and faster transfers.
- Avoids exposing full verdict data (snippets, metadata) on every read.

**Indexes:**

| Field        | Type       | Purpose                      |
|--------------|------------|------------------------------|
| `createdAt`  | Descending | Show newest claims first     |

---

### 3.3 `analytics` Collection

Daily aggregated metrics for monitoring and potential admin dashboard.

```typescript
interface DailyAnalytics {
  id: string;                  // Date string: "2026-03-01"
  totalQueries: number;
  verifiedCount: number;
  falseCount: number;
  unverifiedCount: number;
  avgConfidence: number;
  avgProcessingTimeMs: number;
  topClaims: TopClaim[];       // Top 10 most repeated claims
  updatedAt: Timestamp;
}

interface TopClaim {
  claim: string;               // Truncated claim text
  count: number;               // Number of times queried
}
```

**Update Strategy:** Increment counters using `FieldValue.increment()` on each new verdict — atomic, no read-before-write.

---

### 3.4 `systemConfig` Collection

Runtime configuration that can be updated without redeployment.

```typescript
interface SystemConfig {
  maxClaimLength: number;           // 500
  cacheTTLMinutes: number;          // 60
  rateLimitPerMinute: number;       // 20
  searchProviderPriority: string[]; // ["tavily", "google_cse"]
  geminiModel: string;              // "gemini-pro"
  geminiTemperature: number;        // 0.1
  updatedAt: Timestamp;
}
```

---

## 4. Data Lifecycle

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  WRITE PATH  │     │  READ PATH   │     │  CLEANUP     │
│              │     │              │     │              │
│ 1. User      │     │ 1. Trending  │     │ 1. TTL-based │
│    submits   │     │    board     │     │    deletion  │
│    claim     │     │    queries   │     │    (90 days) │
│              │     │    trending  │     │              │
│ 2. Backend   │     │    collection│     │ 2. Scheduled │
│    processes │     │              │     │    Cloud     │
│    RAG chain │     │ 2. Cache     │     │    Function  │
│              │     │    checks    │     │    runs      │
│ 3. Verdict   │     │    verdicts  │     │    weekly    │
│    saved to  │     │    by hash   │     │              │
│    verdicts  │     │              │     │ 3. Analytics │
│              │     │ 3. Analytics │     │    aggregated│
│ 4. Trending  │     │    reads     │     │    daily     │
│    item      │     │    analytics │     │              │
│    created   │     │    collection│     │              │
│              │     │              │     │              │
│ 5. Analytics │     │              │     │              │
│    counter   │     │              │     │              │
│    incremented│    │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
```

---

## 5. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Verdicts: Backend writes only, no direct client reads
    match /verdicts/{verdictId} {
      allow read: if false;   // Only accessed via backend API
      allow write: if false;  // Only backend (admin SDK) writes
    }

    // Trending: Client can read (for real-time dashboard), no writes
    match /trending/{itemId} {
      allow read: if true;    // Public read for trending board
      allow write: if false;  // Only backend (admin SDK) writes
    }

    // Analytics: No client access
    match /analytics/{dateId} {
      allow read: if false;
      allow write: if false;
    }

    // System Config: No client access
    match /systemConfig/{docId} {
      allow read: if false;
      allow write: if false;
    }
  }
}
```

---

## 6. Estimated Data Volume

| Phase    | Queries/Day | Docs/Day (verdicts) | Docs/Day (trending) | Storage/Month |
|----------|-------------|---------------------|----------------------|---------------|
| MVP      | ~100        | ~100                | ~100                 | ~5 MB         |
| Growth   | ~10,000     | ~10,000             | ~10,000              | ~500 MB       |
| Scale    | ~100,000    | ~100,000 (deduplicated) | ~20,000 (capped) | ~5 GB     |

**Cost Estimate (Firestore Free Tier):**
- 50K reads/day, 20K writes/day, 1 GB storage = Free
- MVP will comfortably stay within free tier.

---

## 7. Data Migration Plan

| Version | Change                            | Migration Strategy                   |
|---------|-----------------------------------|--------------------------------------|
| v1.0    | Initial schema                    | Fresh deployment, no migration       |
| v1.1    | Add `language` field to verdicts  | Default to "en" for existing docs    |
| v2.0    | Add `userId` field (post-auth)    | Default to "anonymous" for existing  |

---

*Document Version: 1.0 — March 2026*
