# Trust_Lens — MVP Technical Document

## 1. MVP Objective

Build a functional prototype where a user can **paste a claim** and receive an **AI-powered, source-backed verdict** (✅ Verified / 🚩 False) in under 10 seconds — all grounded in live government sources.

---

## 2. MVP Scope

### In Scope (v1.0)

| Feature                        | Description                                                        |
|--------------------------------|--------------------------------------------------------------------|
| Claim Input                    | Single text input field for pasting claims                         |
| RAG Fact-Check Pipeline        | LangChain.js → Tavily/Google CSE → Gemini → Verdict               |
| Traffic Light Verdict Card     | ✅ Verified / 🚩 False / ⚠️ Unverified with explanation            |
| Source Citations               | Direct links to the official .gov.in documents used                |
| Trending Misinfo Dashboard     | Real-time list of recent queries powered by Firestore              |
| Basic Responsive UI            | Mobile-friendly layout (primary target: WhatsApp mobile users)     |

### Out of Scope (Post-MVP)

- User accounts / authentication
- Multi-language support (Hindi, Tamil, etc.)
- WhatsApp/Telegram bot integration
- Browser extension
- Admin panel / moderation
- Offline mode / PWA

---

## 3. Technical Specifications

### 3.1 Frontend

| Item          | Choice               | Justification                              |
|---------------|----------------------|--------------------------------------------|
| Framework     | React.js (via Vite)  | Fast HMR, lightweight bundle               |
| Styling       | Tailwind CSS         | Rapid prototyping, utility-first            |
| HTTP Client   | Fetch API / Axios    | Call backend REST endpoints                 |
| Real-time     | Firebase SDK         | `onSnapshot` for trending board             |
| Deployment    | Vercel / Firebase Hosting | Free tier, instant deploys             |

**Key Components:**

```
src/
├── components/
│   ├── ClaimInput.jsx        # Text area + Submit button
│   ├── VerdictCard.jsx       # Traffic light result display
│   ├── SourceList.jsx        # Clickable source URLs
│   ├── TrendingBoard.jsx     # Real-time trending claims
│   ├── Header.jsx            # App header with logo
│   └── LoadingSpinner.jsx    # Loading state indicator
├── pages/
│   └── Home.jsx              # Main page layout
├── services/
│   ├── api.js                # Backend API calls
│   └── firebase.js           # Firestore client config
├── App.jsx
├── main.jsx
└── index.css                 # Tailwind directives + custom styles
```

---

### 3.2 Backend

| Item          | Choice               | Justification                              |
|---------------|----------------------|--------------------------------------------|
| Runtime       | Node.js (v18+)       | JS ecosystem consistency with frontend     |
| Framework     | Express.js           | Minimal, flexible REST server              |
| Orchestrator  | LangChain.js         | Modular RAG chain; easy tool/LLM swapping  |
| LLM           | Google Gemini API    | Strong reasoning, multilingual, free tier   |
| Search Tool   | Tavily API           | AI-optimized search with domain filtering  |
| Fallback      | Google Custom Search | Precise `.gov.in` domain restriction       |

**Key Modules:**

```
src/
├── routes/
│   └── factcheck.js          # POST /api/fact-check
├── chains/
│   ├── ragChain.js           # Main LangChain RAG pipeline
│   └── promptTemplates.js    # Prompt engineering templates
├── tools/
│   ├── tavilySearch.js       # Tavily API integration
│   └── googleCSE.js          # Google Custom Search fallback
├── services/
│   └── firestore.js          # Save query + verdict to DB
├── utils/
│   └── formatVerdict.js      # Structure raw LLM output
├── app.js                    # Express app setup
└── server.js                 # Entry point
```

---

### 3.3 Database Schema (Firestore)

**Collection: `verdicts`**

```json
{
  "id": "auto-generated",
  "claim": "Free laptops being distributed under PM Yojana",
  "verdict": "false",
  "confidence": 0.92,
  "explanation": "No such scheme exists. The PIB has officially debunked this claim.",
  "sources": [
    "https://pib.gov.in/factcheck/12345"
  ],
  "retrievedSnippets": [
    "PIB Fact Check: Claim about free laptops is FALSE..."
  ],
  "createdAt": "2026-03-01T12:00:00Z",
  "queryCount": 1
}
```

---

## 4. API Contract

### `POST /api/fact-check`

**Request Body:**

```json
{
  "claim": "Government giving ₹5000 to all students through PM Digital Scheme"
}
```

**Response Body:**

```json
{
  "verdict": "false",
  "confidence": 0.88,
  "explanation": "There is no 'PM Digital Scheme' offering ₹5000 to students. The PIB has flagged similar claims as fraudulent.",
  "sources": [
    {
      "title": "PIB Fact Check #4521",
      "url": "https://pib.gov.in/factcheck/4521"
    }
  ],
  "timestamp": "2026-03-01T12:00:00Z"
}
```

**Error Response:**

```json
{
  "error": "Unable to process claim",
  "message": "Search API rate limit exceeded. Please try again later.",
  "code": 429
}
```

---

## 5. Environment Variables

```env
# Gemini
GEMINI_API_KEY=your_gemini_api_key

# Tavily Search
TAVILY_API_KEY=your_tavily_api_key

# Google Custom Search (fallback)
GOOGLE_CSE_API_KEY=your_google_cse_key
GOOGLE_CSE_CX=your_custom_search_engine_id

# Firebase
FIREBASE_PROJECT_ID=trust-lens
FIREBASE_API_KEY=your_firebase_api_key

# Server
PORT=3001
NODE_ENV=development
```

---

## 6. MVP Prompt Template (Core)

```text
You are Trust_Lens, a government fact-checking AI for India.

TASK: Determine whether the following CLAIM is true, false, or unverifiable
based ONLY on the RETRIEVED EVIDENCE provided below.

RULES:
1. You MUST base your verdict ONLY on the retrieved evidence.
2. If the evidence does not support or deny the claim, mark it as "unverified".
3. Never guess or use your training data.
4. Respond in plain, simple language a 10th-grade student can understand.

CLAIM:
{user_claim}

RETRIEVED EVIDENCE:
{retrieved_documents}

Respond ONLY in this JSON format:
{
  "verdict": "verified" | "false" | "unverified",
  "confidence": 0.0 to 1.0,
  "explanation": "A 2-sentence plain-language summary."
}
```

---

## 7. Performance Targets (MVP)

| Metric                     | Target           |
|----------------------------|------------------|
| End-to-end latency         | < 10 seconds     |
| Search retrieval time      | < 3 seconds      |
| LLM generation time        | < 5 seconds      |
| UI render (verdict card)   | < 500ms          |
| Concurrent users (MVP)     | ~50 simultaneous |

---

## 8. Development Milestones

| Milestone                  | Timeline   | Status    |
|----------------------------|------------|-----------|
| Project setup & boilerplate| Day 1      | ⬜ To Do  |
| Backend RAG pipeline       | Day 1–2    | ⬜ To Do  |
| Frontend UI (input + card) | Day 2–3    | ⬜ To Do  |
| Frontend ↔ Backend integration | Day 3  | ⬜ To Do  |
| Firestore + Trending Board | Day 3–4    | ⬜ To Do  |
| Testing & polish           | Day 4–5    | ⬜ To Do  |
| Deployment                 | Day 5      | ⬜ To Do  |

---

## 9. Testing Strategy

| Level         | Tool / Approach                   | Coverage                          |
|---------------|-----------------------------------|-----------------------------------|
| Unit Tests    | Jest / Vitest                     | Utility functions, formatters     |
| Integration   | Supertest                         | API endpoint request/response     |
| E2E           | Manual / Cypress (post-MVP)       | Full user flow                    |
| Prompt Testing| Curated claim dataset (20 claims) | Validate LLM verdict accuracy     |

---

*Document Version: 1.0 — March 2026*
