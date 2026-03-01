# Trust_Lens — System Architecture

## 1. Architecture Overview

Trust_Lens follows a **three-tier, event-driven architecture** with a RAG (Retrieval-Augmented Generation) pipeline at its core. The system is designed for low-latency, high-trust fact-checking of government scheme and election claims.

---

## 2. Architecture Diagram

```
┌───────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION TIER                            │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    React SPA (Vite + Tailwind)                  │  │
│  │  ┌─────────┐  ┌──────────────┐  ┌────────────┐  ┌───────────┐ │  │
│  │  │ClaimInput│  │ VerdictCard  │  │TrendingBoard│  │ AboutModal│ │  │
│  │  └────┬────┘  └──────▲───────┘  └──────▲─────┘  └───────────┘ │  │
│  └───────┼──────────────┼──────────────────┼────────────────────────┘  │
│          │ REST         │ JSON             │ Real-time (WebSocket)    │
└──────────┼──────────────┼──────────────────┼─────────────────────────┘
           │              │                  │
┌──────────┼──────────────┼──────────────────┼─────────────────────────┐
│          │     APPLICATION TIER            │                          │
│  ┌───────▼──────────────┴──────────┐       │                          │
│  │       Express.js API Server     │       │                          │
│  │  ┌──────────────────────────┐   │       │                          │
│  │  │   Middleware Stack       │   │       │                          │
│  │  │  • CORS                  │   │       │                          │
│  │  │  • Rate Limiter          │   │       │                          │
│  │  │  • Input Sanitizer       │   │       │                          │
│  │  │  • Request Logger        │   │       │                          │
│  │  └──────────┬───────────────┘   │       │                          │
│  │             │                   │       │                          │
│  │  ┌──────────▼───────────────┐   │       │                          │
│  │  │   Route: /api/fact-check │   │       │                          │
│  │  └──────────┬───────────────┘   │       │                          │
│  │             │                   │       │                          │
│  │  ┌──────────▼───────────────┐   │       │                          │
│  │  │    Cache Layer           │   │       │                          │
│  │  │  (In-Memory / Redis)     │   │       │                          │
│  │  └──────┬───────────────────┘   │       │                          │
│  │         │ MISS                  │       │                          │
│  │  ┌──────▼───────────────────┐   │       │                          │
│  │  │  LangChain.js RAG Chain │   │       │                          │
│  │  │  ┌─────────────────────┐ │   │       │                          │
│  │  │  │ 1. Query Generator  │ │   │       │                          │
│  │  │  │ 2. Source Retriever │ │   │       │                          │
│  │  │  │ 3. Doc Ranker      │ │   │       │                          │
│  │  │  │ 4. Prompt Builder  │ │   │       │                          │
│  │  │  │ 5. LLM Adjudicator │ │   │       │                          │
│  │  │  │ 6. Response Parser │ │   │       │                          │
│  │  │  └─────────────────────┘ │   │       │                          │
│  │  └──────────────────────────┘   │       │                          │
│  └─────────────────────────────────┘       │                          │
│                                            │                          │
└────────────────────────────────────────────┼──────────────────────────┘
                                             │
┌────────────────────────────────────────────┼──────────────────────────┐
│                         DATA TIER          │                          │
│                                            │                          │
│  ┌──────────────┐  ┌──────────────┐  ┌─────┴──────────┐             │
│  │  Tavily API  │  │  Google CSE  │  │   Firestore    │             │
│  │  (Search)    │  │  (Search)    │  │   (Verdicts)   │             │
│  └──────────────┘  └──────────────┘  └────────────────┘             │
│                                                                      │
│  ┌──────────────┐                                                    │
│  │  Gemini API  │                                                    │
│  │  (LLM)       │                                                    │
│  └──────────────┘                                                    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Specifications

### 3.1 Presentation Tier

| Component        | Technology        | Responsibility                               |
|------------------|-------------------|----------------------------------------------|
| `ClaimInput`     | React + Tailwind  | Accept user claims, validate, submit          |
| `VerdictCard`    | React + Tailwind  | Render verdict with traffic light system      |
| `SourceList`     | React             | Display clickable government source links     |
| `TrendingBoard`  | React + Firebase  | Real-time trending misinformation display     |
| `LoadingSpinner` | React + CSS       | Processing state indicator                    |
| `ErrorBanner`    | React             | Error handling and retry UI                   |
| `AboutModal`     | React             | How-it-works explanation modal                |

---

### 3.2 Application Tier

#### Middleware Pipeline

```
Request → CORS → Rate Limiter → Body Parser → Input Sanitizer → Logger → Router
```

| Middleware        | Package                  | Configuration                    |
|-------------------|--------------------------|----------------------------------|
| CORS              | `cors`                   | Whitelist frontend origin only   |
| Rate Limiter      | `express-rate-limit`     | 20 req/min per IP                |
| Body Parser       | `express.json()`         | Limit: 10KB                      |
| Input Sanitizer   | `xss` / custom           | Strip HTML, limit 500 chars      |
| Request Logger    | `morgan` / custom        | Log method, path, status, time   |

#### RAG Chain Stages

| Stage             | Module               | Input                    | Output                       |
|-------------------|-----------------------|--------------------------|------------------------------|
| Query Generator   | `queryGenerator.js`   | Raw claim text           | 2–3 optimized search queries |
| Source Retriever   | `sourceRetriever.js`  | Search queries           | Raw search results (10 max)  |
| Document Ranker   | `docRanker.js`        | Raw results              | Top 5 ranked documents       |
| Prompt Builder    | `promptBuilder.js`    | Claim + top documents    | Formatted LLM prompt         |
| LLM Adjudicator   | `llmAdjudicator.js`   | Formatted prompt         | Raw LLM JSON response        |
| Response Parser   | `responseParser.js`   | Raw LLM response         | Validated verdict object     |

---

### 3.3 Data Tier

| Service          | Type           | Purpose                           | Failure Strategy              |
|------------------|----------------|-----------------------------------|-------------------------------|
| Tavily API       | External SaaS  | Primary document retrieval        | Fallback to Google CSE        |
| Google CSE       | External SaaS  | Secondary document retrieval      | Return "unverified"           |
| Gemini API       | External SaaS  | LLM reasoning + verdict gen       | Retry 2× → return "unverified"|
| Firestore        | Managed DB     | Verdict storage + real-time sync  | Non-blocking; skip on failure |

---

## 4. Communication Patterns

### 4.1 Synchronous (Request-Response)

```
Frontend ──POST /api/fact-check──▶ Backend ──▶ Search APIs ──▶ Gemini ──▶ Response
```

- Used for the primary fact-check flow.
- Timeout: 15 seconds (client-side), 20 seconds (server-side).

### 4.2 Asynchronous (Fire-and-Forget)

```
Backend ──async write──▶ Firestore (does NOT block client response)
```

- Used for persisting verdicts.
- If Firestore write fails → log the error, user still gets their verdict.

### 4.3 Real-Time (Push)

```
Firestore ──onSnapshot──▶ Frontend (TrendingBoard component)
```

- Used for the trending misinformation dashboard.
- Firestore client SDK handles WebSocket connection.

---

## 5. Data Flow Architecture

```
            ┌──────────────────────────────────────────────────┐
            │              DATA FLOW OVERVIEW                   │
            └──────────────────────────────────────────────────┘

  Input Path:          Claim Text (string)
                            │
                      ┌─────▼─────┐
                      │ Normalize │  (lowercase, trim, sanitize)
                      └─────┬─────┘
                            │
                      ┌─────▼─────┐
                      │Cache Check│  (SHA-256 hash lookup)
                      └──┬────┬───┘
                    HIT  │    │ MISS
                    ┌────▼┐ ┌─▼────────┐
                    │Return│ │RAG Chain │
                    │cached│ │execution │
                    │result│ └────┬─────┘
                    └──────┘      │
                                  │
            ┌─────────────────────┼────────────────────┐
            │                     │                    │
      ┌─────▼──────┐      ┌──────▼──────┐     ┌──────▼──────┐
      │   Search    │      │   Gemini    │     │  Firestore  │
      │   APIs      │      │   API       │     │  (persist)  │
      └─────────────┘      └─────────────┘     └─────────────┘

  Output Path:         Verdict JSON
                        {
                          verdict: "verified" | "false" | "unverified",
                          confidence: 0.0–1.0,
                          explanation: "...",
                          sources: [...]
                        }
```

---

## 6. Error Handling Architecture

```
┌────────────────────────────────────────────────────────┐
│                  ERROR HANDLING CHAIN                    │
│                                                        │
│  Layer 1: Input Validation                             │
│  ├── Empty claim → 400 "Claim is required"             │
│  └── Too long   → 400 "Claim exceeds 500 characters"  │
│                                                        │
│  Layer 2: Search Failures                              │
│  ├── Tavily fails  → Fallback to Google CSE            │
│  ├── Both fail     → Return "unverified" + explanation │
│  └── Timeout (>5s) → Use partial results if available  │
│                                                        │
│  Layer 3: LLM Failures                                 │
│  ├── Gemini timeout → Retry (max 2×, exp backoff)      │
│  ├── Malformed JSON → Return "unverified"              │
│  └── Rate limited   → 429 to client                    │
│                                                        │
│  Layer 4: Persistence Failures                         │
│  ├── Firestore down → Log error; return verdict anyway │
│  └── Write timeout  → Fire-and-forget; skip silently   │
│                                                        │
│  Layer 5: Global Error Handler                         │
│  └── Unhandled exception → 500 + sanitized message     │
└────────────────────────────────────────────────────────┘
```

---

## 7. Security Architecture

```
┌──────────────────────────────────────────────┐
│             SECURITY LAYERS                   │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Transport: HTTPS (TLS 1.3)           │  │
│  │  Enforced at hosting / CDN level       │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Network: CORS Whitelist               │  │
│  │  Only frontend origin allowed          │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Application: Rate Limiting + Sanitize │  │
│  │  20 req/min/IP + Strip HTML + 500 char │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Secrets: Env Vars / Secrets Manager   │  │
│  │  Never in source code or client bundle │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Data: No PII, Anonymous Queries       │  │
│  │  No user tracking or identification    │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

---

## 8. Deployment Architecture

### 8.1 MVP

| Component   | Platform                | Method                  |
|-------------|-------------------------|-------------------------|
| Frontend    | Vercel / Firebase Hosting | `vite build` → deploy |
| Backend     | Vercel Serverless / Cloud Run | Express as serverless function |
| Database    | Firebase Firestore       | Managed, auto-scaled   |

### 8.2 Production

| Component   | Platform                | Method                  |
|-------------|-------------------------|-------------------------|
| Frontend    | CDN (Cloudflare / Vercel) | Static SPA global CDN |
| Backend     | Google Cloud Run         | Docker containers, auto-scale |
| Cache       | Redis (Memorystore)      | Managed Redis instance  |
| Database    | Firestore                | Multi-region            |
| Monitoring  | Cloud Logging + Alerts   | p95 latency, error rates|

---

## 9. Technology Matrix

| Layer            | Technology         | Version     | License     |
|------------------|--------------------|-------------|-------------|
| Frontend         | React              | 18+         | MIT         |
| Build Tool       | Vite               | 5+          | MIT         |
| Styling          | Tailwind CSS       | 3+          | MIT         |
| Backend          | Express.js         | 4.x         | MIT         |
| RAG Orchestrator | LangChain.js       | 0.2+        | MIT         |
| LLM              | Google Gemini      | gemini-pro  | Proprietary |
| Search (Primary) | Tavily API         | v1          | Proprietary |
| Search (Fallback)| Google Custom Search | v1         | Proprietary |
| Database         | Firebase Firestore | v10+        | Proprietary |
| Runtime          | Node.js            | 18+         | MIT         |

---

*Document Version: 1.0 — March 2026*
