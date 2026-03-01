# Trust_Lens — Architecture Document

## 1. Overview

Trust_Lens is a real-time, AI-powered fact-checking engine built on a **Retrieval-Augmented Generation (RAG)** architecture. It combats misinformation about Indian government schemes and elections by grounding every AI verdict in live, verified government sources — never relying on static training data or guesswork.

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Tailwind)                    │
│  ┌────────────┐  ┌────────────────┐  ┌───────────────────────────┐ │
│  │ Claim Input │  │ Verdict Card   │  │ Trending Misinfo Board    │ │
│  └─────┬──────┘  └───────▲────────┘  └────────────▲──────────────┘ │
│        │                 │                         │                │
└────────┼─────────────────┼─────────────────────────┼────────────────┘
         │  HTTP / REST    │                         │  Real-time
         ▼                 │                         │  (Firestore)
┌────────┴─────────────────┴─────────────────────────┴────────────────┐
│                     BACKEND  (Node.js / LangChain.js)               │
│                                                                     │
│  ┌──────────────┐  ┌──────────────────┐  ┌───────────────────────┐ │
│  │  Ingestion   │  │  RAG Orchestrator │  │  Output Formatter    │ │
│  │  Controller  │──▶  (LangChain.js)   │──▶  (Plain Language)    │ │
│  └──────────────┘  └───────┬──────────┘  └───────────────────────┘ │
│                            │                                        │
└────────────────────────────┼────────────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌──────────────┐ ┌───────────┐ ┌──────────────┐
     │ Tavily API / │ │ Gemini    │ │  Firebase    │
     │ Google CSE   │ │ API       │ │  Firestore   │
     │ (.gov.in)    │ │ (LLM)     │ │  (Storage)   │
     └──────────────┘ └───────────┘ └──────────────┘
```

---

## 3. Architectural Layers

### 3.1 Presentation Layer (Frontend)

| Aspect       | Detail                                      |
|--------------|---------------------------------------------|
| Framework    | React.js (Vite)                             |
| Styling      | Tailwind CSS                                |
| Key Views    | Claim Input, Verdict Card, Trending Board   |
| State Mgmt   | React Context / lightweight store           |
| Real-time    | Firestore `onSnapshot` for trending data    |

**Responsibilities:**
- Accept user claims (text input, paste from WhatsApp/Twitter).
- Render the "Traffic Light" verdict card (✅ Verified / 🚩 False).
- Display a live "Trending Misinformation" analytics board powered by Firestore real-time subscriptions.

---

### 3.2 Orchestration Layer (Backend / RAG Pipeline)

| Aspect       | Detail                                      |
|--------------|---------------------------------------------|
| Runtime      | Node.js                                     |
| Orchestrator | LangChain.js                                |
| LLM          | Google Gemini API                           |
| Search       | Tavily API / Google Custom Search Engine     |

**Responsibilities:**
- Receive the user's claim from the frontend.
- Orchestrate the full RAG pipeline: Retrieve → Augment → Generate.
- Return a structured JSON verdict to the frontend.

---

### 3.3 Data & Persistence Layer

| Aspect       | Detail                                      |
|--------------|---------------------------------------------|
| Database     | Firebase Firestore (NoSQL)                  |
| Use Cases    | Store queries, verdicts, timestamps          |
| Analytics    | Power the "Trending Misinfo" dashboard      |
| Auth         | Firebase Auth (optional, for future use)     |

---

## 4. Core RAG Pipeline — Detailed Flow

The RAG pipeline is the heart of Trust_Lens. It ensures the AI **never hallucinates** by forcing it to cite real, retrieved documents.

```
Step 1: INGEST
  User submits a claim string.
  │
  ▼
Step 2: RETRIEVE
  LangChain.js triggers a targeted search via:
    • Tavily API   — focused on .gov.in domains
    • Google CSE   — restricted to PIB, ECI, MyGov portals
  Retrieves top-K relevant government documents/snippets.
  │
  ▼
Step 3: AUGMENT
  The retrieved snippets are injected into a carefully crafted
  prompt template alongside the original claim.
  │
  ▼
Step 4: GENERATE
  Gemini API acts as the "adjudicator":
    • Cross-references claim vs. official text.
    • Detects discrepancies, contradictions, or confirmations.
    • Outputs a structured verdict (JSON).
  │
  ▼
Step 5: FORMAT & RESPOND
  The backend formats the raw LLM output into:
    • verdict:  "verified" | "false" | "unverified"
    • confidence: 0.0 – 1.0
    • explanation: 2-sentence plain-language summary
    • sources: array of source URLs
  │
  ▼
Step 6: PERSIST
  The query + verdict are saved to Firestore for
  analytics and the trending dashboard.
```

---

## 5. Trusted Source Anchors

Trust_Lens restricts its retrieval to a curated set of authoritative government sources:

| Source                     | Domain              | Content Type                        |
|----------------------------|---------------------|-------------------------------------|
| PIB Fact Check             | pib.gov.in          | Official fact-check articles        |
| Election Commission of India | eci.gov.in        | Election rules, notifications       |
| MyGov Portal               | mygov.in            | Government scheme details           |
| India.gov.in               | india.gov.in        | Central government services portal  |

> **Why this matters:** By restricting retrieval to `.gov.in` domains through the search API configuration, we eliminate the possibility of the AI using unreliable blog posts, social media, or biased news outlets as evidence.

---

## 6. Key Architectural Decisions

| Decision                                  | Rationale                                                                 |
|-------------------------------------------|---------------------------------------------------------------------------|
| RAG over fine-tuned LLM                   | Ensures real-time, verifiable sourcing; avoids hallucination.             |
| LangChain.js as orchestrator              | Provides modular, chainable pipeline; easy to swap LLM or search tools.  |
| Gemini API over local models              | Cloud-hosted, scales without GPU infrastructure; strong multilingual support. |
| Firestore for persistence                 | Real-time sync for trending board; serverless scaling; generous free tier. |
| Tavily + Google CSE (dual search)         | Redundancy; Tavily excels at AI-optimized retrieval, CSE provides precise domain filtering. |
| Traffic Light UI over detailed reports    | Designed for accessibility — the target user may have limited literacy.   |

---

## 7. Security & Trust Considerations

- **No user PII is collected** — claims are stored anonymously.
- **API keys** are stored in environment variables (`.env`), never committed to source control.
- **Rate limiting** is applied on the backend to prevent API abuse.
- **Source transparency** — every verdict includes clickable links to the original government documents, so users can verify independently.

---

## 8. Scalability Path

| Phase       | Scale                   | Infrastructure                          |
|-------------|-------------------------|-----------------------------------------|
| MVP         | ~100 queries/day        | Single Node.js server + Firebase free tier |
| Growth      | ~10,000 queries/day     | Cloud Run / Cloud Functions + Firestore scaling |
| National    | ~1M+ queries/day        | Load-balanced microservices + CDN + caching layer (Redis) |

---

## 9. Folder Structure (Reference)

```
trust-lens/
├── docs/                    # ← You are here
│   ├── Architecture.md
│   ├── mvp-techdoc.md
│   ├── Prd.md
│   └── system-design.md
├── frontend/                # React + Tailwind app
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/                 # Node.js + LangChain.js
│   ├── src/
│   ├── .env.example
│   └── package.json
├── firebase/                # Firestore rules & config
│   └── firestore.rules
├── .gitignore
└── README.md
```

---

*Document Version: 1.0 — March 2026*
