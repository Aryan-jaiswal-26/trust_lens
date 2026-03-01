# Trust_Lens — Information Architecture

## 1. Overview

This document defines the information architecture (IA) of Trust_Lens — how content, features, and navigation are organized to create an intuitive user experience. The primary design goal is **zero-friction fact-checking** for users of all literacy levels.

---

## 2. Site Map

```
Trust_Lens (Single Page Application)
│
├── 🏠 Home Page (/)
│   ├── Header
│   │   ├── Logo / Brand Name
│   │   ├── Tagline: "India's Truth Engine"
│   │   └── Info Icon → About Modal
│   │
│   ├── Hero Section
│   │   ├── Headline: "Verify any government claim instantly"
│   │   ├── Subheadline: "Powered by official sources"
│   │   └── Claim Input Area
│   │       ├── Text Input Field (500 chars max)
│   │       ├── Character Counter
│   │       └── "Check This Claim" Button
│   │
│   ├── Verdict Section (conditionally rendered)
│   │   ├── Loading State (skeleton / spinner)
│   │   ├── Verdict Card
│   │   │   ├── Traffic Light Icon (✅ / 🚩 / ⚠️)
│   │   │   ├── Verdict Label ("Verified" / "False" / "Unverified")
│   │   │   ├── Explanation (2 sentences, plain language)
│   │   │   ├── Confidence Bar (0–100%)
│   │   │   └── Source Links (clickable .gov.in URLs)
│   │   └── Error State (if API fails)
│   │       ├── Error Message
│   │       └── "Try Again" Button
│   │
│   ├── Trending Section
│   │   ├── Section Header: "🔥 Trending Claims"
│   │   ├── Claim List (real-time, up to 20 items)
│   │   │   └── Claim Item
│   │   │       ├── Claim Text (truncated to 80 chars)
│   │   │       ├── Verdict Icon (✅ / 🚩 / ⚠️)
│   │   │       └── Timestamp ("2 min ago")
│   │   └── "Load More" (deferred, post-MVP)
│   │
│   └── Footer
│       ├── Disclaimer: "AI-generated results. Always verify with official sources."
│       ├── Built with ❤️ for India
│       └── GitHub Link
│
├── ℹ️ About Modal (overlay)
│   ├── What is Trust_Lens?
│   ├── How does it work? (3-step visual)
│   ├── What sources do we use?
│   └── Close Button
│
└── 🔗 External Links (open in new tab)
    ├── pib.gov.in
    ├── eci.gov.in
    └── mygov.in
```

---

## 3. Content Hierarchy

### 3.1 Visual Priority (Top → Bottom)

| Priority | Element                | Purpose                                    |
|----------|------------------------|--------------------------------------------|
| 1 (Top)  | Claim Input            | Primary action — where users start         |
| 2        | Verdict Card           | Primary result — the answer they came for  |
| 3        | Source Links           | Trust builder — proof of verdict            |
| 4        | Trending Dashboard     | Discovery — browse trending misinformation |
| 5        | Footer / Disclaimer    | Context & transparency                     |

### 3.2 Information Density Levels

| Screen Width  | Columns | Adjustments                                |
|---------------|---------|---------------------------------------------|
| < 480px       | 1       | Full-width cards, stacked layout            |
| 480–768px     | 1       | Wider cards with more padding               |
| 768–1024px    | 1–2     | Verdict card + trending side-by-side        |
| > 1024px      | 2       | Two-column layout: main + trending sidebar  |

---

## 4. Navigation Model

Trust_Lens uses a **single-page, scroll-based** navigation model with no complex routing.

```
┌──────────────────────────────────────────┐
│              NAVIGATION MODEL             │
│                                          │
│   Type: Single Page Application (SPA)    │
│   Router: Not required (single route)    │
│   Navigation: Vertical scroll            │
│                                          │
│   Sections (scroll order):               │
│   1. Hero + Claim Input                  │
│   2. Verdict Display                     │
│   3. Trending Dashboard                  │
│   4. Footer                              │
│                                          │
│   Modals:                                │
│   • About / How It Works                 │
│                                          │
│   External Links:                        │
│   • Source URLs → new tab                │
│   • GitHub → new tab                     │
└──────────────────────────────────────────┘
```

**Why no multi-page routing?**
- The target user may have limited digital literacy.
- A single page reduces cognitive load.
- The entire user flow (input → result → explore trending) is linear.

---

## 5. Content Types & Taxonomy

### 5.1 Content Objects

| Content Object    | Fields                                                        | Source          |
|-------------------|---------------------------------------------------------------|-----------------|
| **Claim**         | text, submittedAt                                             | User input      |
| **Verdict**       | verdict, confidence, explanation, sources[], createdAt        | AI pipeline     |
| **Trending Item** | claim, verdict, timestamp                                     | Firestore       |
| **Source**         | title, url, domain                                            | Search API      |
| **Error**          | code, message, retryable                                      | Backend         |

### 5.2 Verdict Taxonomy

| Verdict       | Icon | Color   | Meaning                                     |
|---------------|------|---------|----------------------------------------------|
| `verified`    | ✅   | Green   | Claim is confirmed by official sources        |
| `false`       | 🚩   | Red     | Claim is debunked by official sources         |
| `unverified`  | ⚠️   | Yellow  | Insufficient evidence to confirm or deny      |

---

## 6. User Mental Model

```
User's Internal Flow:
────────────────────────────────────────────────────

"I got a WhatsApp forward about a government scheme."
                    │
                    ▼
"Is this real? Let me check."
                    │
                    ▼
"I'll paste it into Trust_Lens."
                    │
                    ▼
"Green ✅ = it's real. Red 🚩 = it's fake."
                    │
                    ▼
"I can click the source to see the government page."
                    │
                    ▼
"I'll also check what other fake news is trending."
```

**Design Implication:** The UI must match this mental model exactly — no extra steps, no confusion, no jargon.

---

## 7. Labeling System

### 7.1 UI Labels

| Element              | Label Text                            | Notes                           |
|----------------------|---------------------------------------|---------------------------------|
| Input placeholder    | "Paste a claim to fact-check..."      | Action-oriented                 |
| Submit button        | "Check This Claim"                    | Clear CTA                       |
| Verdict header       | "Verdict"                             | Simple                          |
| Verified label       | "✅ Verified — This claim is true"   | Explicit                        |
| False label          | "🚩 False — This claim is fake"     | Explicit                        |
| Unverified label     | "⚠️ Unverified — Not enough evidence"| Explicit                       |
| Sources header       | "Official Sources"                    | Reinforces trust                |
| Trending header      | "🔥 Trending Claims"                | Engaging                        |
| Loading text         | "Checking with government sources..." | Communicates the process        |
| Disclaimer           | "AI-generated. Verify with official sources." | Transparency          |

### 7.2 Tone of Voice

| Guideline                 | Example                                                  |
|---------------------------|----------------------------------------------------------|
| Plain language             | "This scheme does NOT exist" (not "unsubstantiated")    |
| Short sentences            | Max 15 words per sentence in explanations               |
| Active voice               | "The government has not announced..." (not "It was not announced...") |
| No jargon                  | Avoid: "RAG", "LLM", "vector search", "embeddings"     |
| Empathetic                 | "We understand this is confusing. Here's what we found..." |

---

## 8. Accessibility Information Architecture

| Element          | Accessibility Feature                                     |
|------------------|-----------------------------------------------------------|
| Verdict Icon     | `aria-label="Verdict: False"` (not just emoji)            |
| Confidence Bar   | `role="progressbar"` with `aria-valuenow`                |
| Source Links     | Descriptive link text (not "click here")                  |
| Loading State    | `aria-live="polite"` for screen reader announcements      |
| Error Messages   | `role="alert"` for immediate screen reader feedback       |
| Input Field      | `<label>` element: "Enter a claim to fact-check"          |

---

## 9. Future IA Extensions (Post-MVP)

| Extension               | Structural Change                                     |
|--------------------------|-------------------------------------------------------|
| Multi-language toggle    | Language selector in header                           |
| Search/filter trending   | Search bar + category filters above trending list     |
| User history             | New "My Checks" page (requires auth)                 |
| Share verdict            | Share button on verdict card → generates image/link   |
| Categories               | Tags: "Schemes", "Elections", "Health", "Finance"    |

---

*Document Version: 1.0 — March 2026*
