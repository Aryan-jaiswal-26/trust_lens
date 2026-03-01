# Trust_Lens — System Design Document

## 1. Introduction

This document describes the end-to-end system design of Trust_Lens — a real-time, AI-powered fact-checking engine for Indian government schemes and elections. It covers component interactions, data flow, failure handling, caching, deployment, and observability.

---

## 2. System Context Diagram

```
                    ┌─────────────┐
                    │   Citizens   │
                    │  (Browser /  │
                    │   Mobile)    │
                    └──────┬──────┘
                           │ HTTPS
                           ▼
                  ┌────────────────┐
                  │   CDN / Edge   │
                  │  (Vercel/CF)   │
                  └───────┬────────┘
                          │
              ┌───────────┼───────────┐
              ▼                       ▼
   ┌──────────────────┐    ┌──────────────────┐
   │  React Frontend  │    │  Static Assets   │
   │  (SPA - Vite)    │    │  (JS/CSS/Images) │
   └────────┬─────────┘    └──────────────────┘
            │ REST API
            ▼
   ┌──────────────────────────────────────┐
   │       Node.js Backend (Express)      │
   │  ┌──────────────────────────────┐    │
   │  │    LangChain.js RAG Chain    │    │
   │  │  ┌────────┐  ┌───────────┐  │    │
   │  │  │Retriever│  │ LLM Agent │  │    │
   │  │  └───┬────┘  └─────┬─────┘  │    │
   │  └──────┼──────────────┼────────┘    │
   └─────────┼──────────────┼─────────────┘
             │              │
     ┌───────┴───┐    ┌─────┴──────┐
     ▼           ▼    ▼            ▼
┌─────────┐ ┌──────┐ ┌──────┐ ┌──────────┐
│ Tavily  │ │Google│ │Gemini│ │ Firebase │
│ Search  │ │ CSE  │ │ API  │ │ Firestore│
│ API     │ │ API  │ │      │ │          │
└─────────┘ └──────┘ └──────┘ └──────────┘
```

---

## 3. Component Design

### 3.1 Frontend (React SPA)

**Responsibility:** User interface, claim submission, verdict display, trending board.

```
┌─────────────────────────────────────────────┐
│                  App Shell                   │
│  ┌─────────────────────────────────────┐    │
│  │           Header / Navbar            │    │
│  ├─────────────────────────────────────┤    │
│  │                                     │    │
│  │  ┌───────────────────────────────┐  │    │
│  │  │        Claim Input Box        │  │    │
│  │  │  [________________________]   │  │    │
│  │  │  [   Check This Claim ▶  ]    │  │    │
│  │  └───────────────────────────────┘  │    │
│  │                                     │    │
│  │  ┌───────────────────────────────┐  │    │
│  │  │       Verdict Card            │  │    │
│  │  │  ┌──────┐                     │  │    │
│  │  │  │  ✅  │  VERIFIED           │  │    │
│  │  │  └──────┘                     │  │    │
│  │  │  "This scheme exists..."      │  │    │
│  │  │  Confidence: ████████░░ 85%   │  │    │
│  │  │  Sources: [pib.gov.in]        │  │    │
│  │  └───────────────────────────────┘  │    │
│  │                                     │    │
│  │  ┌───────────────────────────────┐  │    │
│  │  │    Trending Misinfo Board     │  │    │
│  │  │  1. "Free laptop scheme..." 🚩│  │    │
│  │  │  2. "₹5000 for voters..." 🚩  │  │    │
│  │  │  3. "New pension rule..." ✅  │  │    │
│  │  └───────────────────────────────┘  │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

**State Management:**

| State            | Type        | Source                    |
|------------------|-------------|---------------------------|
| `claim`          | Local       | User text input            |
| `verdict`        | API Response| Backend REST call          |
| `isLoading`      | Local       | Toggle during API call     |
| `trendingClaims` | Real-time   | Firestore `onSnapshot`     |
| `error`          | Local       | API error handling         |

---

### 3.2 Backend (Node.js + Express)

**Responsibility:** API gateway, RAG orchestration, data persistence.

#### Request Lifecycle

```
Client Request
     │
     ▼
[ Express Router ]
     │
     ├── Input Validation & Sanitization
     │
     ├── Cache Check (in-memory / Redis)
     │     ├── HIT  → Return cached verdict
     │     └── MISS → Continue to pipeline
     │
     ├── RAG Pipeline (LangChain.js)
     │     ├── Step 1: Generate search queries from claim
     │     ├── Step 2: Execute parallel search (Tavily + Google CSE)
     │     ├── Step 3: Rank & filter retrieved documents
     │     ├── Step 4: Build augmented prompt
     │     ├── Step 5: Call Gemini API for verdict
     │     └── Step 6: Parse & validate LLM JSON response
     │
     ├── Format Response
     │
     ├── Save to Firestore (async, non-blocking)
     │
     └── Return JSON to Client
```

#### Error Handling Strategy

| Error Type                | Handling                                        |
|---------------------------|-------------------------------------------------|
| Invalid/empty claim       | 400 Bad Request with message                    |
| Search API failure        | Retry once → fallback to other search provider  |
| Gemini API failure        | Retry with exponential backoff (max 2 retries)  |
| Malformed LLM response    | Return "unverified" with error explanation      |
| Firestore write failure   | Log error; don't block user response            |
| Rate limit exceeded       | 429 Too Many Requests                           |

---

### 3.3 RAG Pipeline (Deep Dive)

```
                    ┌──────────────────────┐
                    │    User's Claim      │
                    │  "Free laptops for   │
                    │   all students..."   │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  Query Formulation   │
                    │  • Extract key terms │
                    │  • Generate 2-3      │
                    │    search queries    │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┼─────────────┐
                 ▼                           ▼
      ┌──────────────────┐        ┌──────────────────┐
      │   Tavily Search  │        │  Google CSE      │
      │  site:gov.in     │        │  cx=.gov.in only │
      │  top 5 results   │        │  top 5 results   │
      └────────┬─────────┘        └────────┬─────────┘
               │                           │
               └──────────┬────────────────┘
                          │
               ┌──────────▼───────────┐
               │  Document Ranking    │
               │  • Deduplicate       │
               │  • Relevance scoring │
               │  • Select top 5      │
               └──────────┬───────────┘
                          │
               ┌──────────▼───────────┐
               │  Prompt Construction │
               │  System Prompt +     │
               │  Claim + Evidence    │
               └──────────┬───────────┘
                          │
               ┌──────────▼───────────┐
               │    Gemini API Call   │
               │  model: gemini-pro  │
               │  temp: 0.1 (low)    │
               │  JSON mode enabled  │
               └──────────┬───────────┘
                          │
               ┌──────────▼───────────┐
               │  Response Parsing   │
               │  • Validate JSON    │
               │  • Check fields     │
               │  • Normalize values │
               └──────────────────────┘
```

**Search Strategy:**

| Provider       | Query Template                                      | Max Results |
|----------------|------------------------------------------------------|-------------|
| Tavily         | `"{claim keywords}" site:gov.in fact check`          | 5           |
| Google CSE     | Custom engine restricted to: pib.gov.in, eci.gov.in, mygov.in | 5 |

**Document Ranking Criteria:**

1. Source authority (PIB > generic .gov.in)
2. Recency (newer documents preferred)
3. Keyword overlap with original claim
4. Content length (prefer substantive documents)

---

## 4. Data Flow (Sequence Diagram)

```
User          Frontend        Backend          Tavily/CSE       Gemini       Firestore
 │               │               │                │               │              │
 │──paste claim─▶│               │                │               │              │
 │               │──POST /api/──▶│                │               │              │
 │               │  fact-check   │                │               │              │
 │               │               │──search query─▶│               │              │
 │               │               │                │──results──────▶              │
 │               │               │◀──documents────│               │              │
 │               │               │                                │              │
 │               │               │──prompt + docs────────────────▶│              │
 │               │               │◀──verdict JSON─────────────────│              │
 │               │               │                                               │
 │               │               │──save verdict (async)─────────────────────────▶│
 │               │◀──JSON resp───│                                               │
 │◀──render card─│               │                                               │
 │               │               │                                               │
 │               │◀──onSnapshot (trending updates)───────────────────────────────│
 │◀──update UI───│               │                                               │
```

---

## 5. Caching Strategy

To reduce latency and API costs, Trust_Lens implements a two-level caching strategy:

### 5.1 In-Memory Cache (MVP)

| Property       | Value                              |
|----------------|------------------------------------|
| Type           | Node.js `Map` or `node-cache`      |
| Key            | SHA-256 hash of normalized claim   |
| TTL            | 1 hour                             |
| Max entries    | 1000                               |
| Hit behavior   | Return cached verdict immediately  |

### 5.2 Redis Cache (Growth Phase)

| Property       | Value                              |
|----------------|------------------------------------|
| Type           | Redis (Cloud Memorystore)          |
| Key            | `verdict:{claim_hash}`             |
| TTL            | 6 hours                            |
| Eviction       | LRU                                |

**Claim Normalization (for cache key):**
1. Convert to lowercase
2. Remove extra whitespace
3. Remove punctuation
4. Sort words alphabetically
5. Hash with SHA-256

---

## 6. Rate Limiting

| Layer          | Limit                    | Window    | Action on Exceed         |
|----------------|--------------------------|-----------|--------------------------|
| Per IP         | 20 requests              | 1 minute  | 429 response             |
| Global         | 500 requests             | 1 minute  | 503 response + queue     |
| Gemini API     | Based on API tier        | Per min   | Exponential backoff      |
| Tavily API     | Based on plan limits     | Per month | Fallback to Google CSE   |

Implementation: `express-rate-limit` middleware.

---

## 7. Deployment Architecture

### 7.1 MVP Deployment

```
┌──────────────────────────────────────────┐
│              Vercel / Firebase            │
│                                          │
│  ┌──────────────┐  ┌──────────────────┐  │
│  │   Frontend   │  │    Backend       │  │
│  │  (Static)    │  │  (Serverless Fn) │  │
│  │  React Build │  │  or Cloud Run    │  │
│  └──────────────┘  └──────────────────┘  │
│                                          │
│  ┌──────────────────────────────────────┐│
│  │         Firebase Firestore           ││
│  │    (Auto-scaled, serverless DB)      ││
│  └──────────────────────────────────────┘│
└──────────────────────────────────────────┘
```

### 7.2 Growth Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                     Google Cloud Platform                     │
│                                                              │
│  ┌──────────┐   ┌──────────────┐   ┌───────────────────┐   │
│  │   CDN    │──▶│ Load Balancer│──▶│  Cloud Run        │   │
│  │ (Global) │   │              │   │  (Auto-scaled     │   │
│  └──────────┘   └──────────────┘   │   containers)     │   │
│                                    └─────────┬─────────┘   │
│                                              │              │
│                          ┌───────────────────┼──────┐      │
│                          ▼                   ▼      ▼      │
│                   ┌───────────┐    ┌──────┐ ┌────────┐     │
│                   │ Firestore │    │Redis │ │Cloud   │     │
│                   │           │    │Cache │ │Logging │     │
│                   └───────────┘    └──────┘ └────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Monitoring & Observability

| Aspect         | Tool / Method                        | What to Monitor                     |
|----------------|--------------------------------------|-------------------------------------|
| Uptime         | UptimeRobot / GCP Health checks      | API endpoint availability           |
| Latency        | Custom middleware logging             | p50, p95, p99 response times        |
| Error Tracking | Console logging → Cloud Logging      | 4xx/5xx rates, stack traces         |
| API Usage      | Counter middleware                    | Gemini/Tavily calls per hour        |
| Verdict Quality| Manual review of stored verdicts     | False positive/negative rate        |
| Cost           | GCP Billing alerts                   | Monthly API spend threshold         |

---

## 9. Security Design

### 9.1 API Security

| Measure                   | Implementation                           |
|---------------------------|------------------------------------------|
| HTTPS only                | Enforced at CDN / hosting level          |
| CORS                      | Whitelist frontend domain only           |
| Input sanitization        | Strip HTML, limit length (500 chars)     |
| Rate limiting             | `express-rate-limit` per IP              |
| API key protection        | `.env` + secrets manager in production   |
| No PII collection         | Claims stored anonymously (no user IDs)  |

### 9.2 Supply Chain Security

| Measure                   | Implementation                           |
|---------------------------|------------------------------------------|
| Dependency auditing       | `npm audit` in CI pipeline               |
| Lockfile                  | `package-lock.json` committed            |
| Minimal dependencies      | Only essential packages installed         |

---

## 10. Failure Modes & Resilience

| Failure Scenario              | Impact    | Auto-Recovery Strategy                     |
|-------------------------------|-----------|---------------------------------------------|
| Tavily API down               | Medium    | Fallback to Google CSE automatically         |
| Google CSE down               | Medium    | Fallback to Tavily; return "unverified"      |
| Both search APIs down         | High      | Return "Service temporarily unavailable"     |
| Gemini API down               | Critical  | Retry 2x → return "unverified" + sources     |
| Firestore down                | Low       | Verdict still returned; skip persistence     |
| High traffic spike            | Medium    | Auto-scaling (Cloud Run); rate limiting      |
| Malicious input (XSS/SQLi)    | Medium    | Input sanitization; no raw HTML rendering    |

---

## 11. Future Scalability Considerations

| Feature                        | Design Consideration                                  |
|--------------------------------|-------------------------------------------------------|
| Multi-language                 | Abstract prompt templates; add translation middleware  |
| WhatsApp Bot                   | Add webhook endpoint; reuse same RAG chain             |
| Batch processing               | Add a queue (Cloud Tasks) for bulk claim verification  |
| ML-based claim deduplication   | Add embedding model to hash claims semantically        |
| Regional source expansion      | Make source whitelist configurable per state/language   |

---

*Document Version: 1.0 — March 2026*
