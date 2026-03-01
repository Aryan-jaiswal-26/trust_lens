# Trust_Lens — Product Requirements Document (PRD)

## 1. Product Summary

**Product Name:** Trust_Lens
**Tagline:** India's Real-Time Truth Engine for Government Facts
**Version:** 1.0 (MVP)
**Date:** March 2026

Trust_Lens is an AI-powered fact-checking platform that allows Indian citizens to instantly verify viral claims about government schemes and elections. It uses a RAG (Retrieval-Augmented Generation) architecture to deliver source-backed, plain-language verdicts grounded exclusively in official government documents.

---

## 2. Problem Statement

### 2.1 The Challenge

Misinformation about government schemes and elections spreads across WhatsApp, Twitter, and Facebook at alarming speed. This creates three critical problems:

1. **Speed Gap:** Fake news reaches millions within hours; human fact-checkers take days to respond.
2. **Real-World Harm:** Citizens miss genuine benefits, fall for financial scams, and lose trust in democratic institutions.
3. **Accessibility Gap:** Even when official debunking exists, it uses bureaucratic language that the average citizen cannot easily understand.

### 2.2 Current Solutions & Their Limitations

| Existing Solution         | Limitation                                                |
|---------------------------|-----------------------------------------------------------|
| PIB Fact Check (manual)   | Slow turnaround (days); limited coverage                  |
| News outlet fact-checks   | Potential bias; paywalled; complex language                |
| Generic AI chatbots       | Hallucinate facts; no verifiable sourcing                 |
| Social media flags        | Inconsistent; easily gamed; no explanation provided       |

### 2.3 Our Opportunity

Trust_Lens fills the gap between the **speed of AI** and the **reliability of official government sources** by combining them through RAG — creating an automated, trustworthy, citizen-friendly fact-checking engine.

---

## 3. Target Users

### 3.1 Primary Personas

| Persona                    | Description                                               | Key Need                                           |
|----------------------------|-----------------------------------------------------------|-----------------------------------------------------|
| 🧑‍🌾 **Everyday Citizen**    | Receives forwarded WhatsApp messages about schemes        | Quick, simple verification in plain language         |
| 🗳️ **First-Time Voter**     | Confused by conflicting election-related claims            | Reliable, authoritative source of truth              |
| 📰 **Local Journalist**     | Needs to verify claims before publishing                   | Fast fact-checking with citable government sources   |
| 👨‍👩‍👧‍👦 **Family WhatsApp Admin** | Acts as the "debunker" in family groups                   | Shareable verdict cards to counter fake forwards     |

### 3.2 User Context

- **Primary device:** Smartphone (Android-dominant).
- **Primary source of misinformation:** WhatsApp forwards, Twitter/X posts, YouTube thumbnails.
- **Literacy level:** Varies widely; the UI must work for users with limited English proficiency.
- **Trust requirement:** Very high — users need to see the **source**, not just the verdict.

---

## 4. Product Goals & Success Metrics

### 4.1 Goals

| Goal                                              | Priority   |
|---------------------------------------------------|------------|
| Deliver instant, source-backed verdicts            | 🔴 P0      |
| Make results understandable for any literacy level  | 🔴 P0      |
| Ground all verdicts in official government sources  | 🔴 P0      |
| Build user trust through source transparency       | 🟠 P1      |
| Enable discovery of trending misinformation        | 🟠 P1      |
| Support mobile-first design                        | 🟠 P1      |

### 4.2 Key Performance Indicators (KPIs)

| KPI                             | Target (MVP)       |
|---------------------------------|--------------------|
| Average verdict latency         | < 10 seconds       |
| Verdict accuracy (test set)     | ≥ 85%              |
| % of verdicts with source links | 100%              |
| Daily active queries            | 100+ (first month) |
| User trust rating (survey)      | ≥ 4.0 / 5.0        |

---

## 5. Feature Requirements

### 5.1 MVP Features (P0)

#### F1: Claim Submission
- Text input field where users paste a suspicious claim.
- Supports free-text (WhatsApp forwards, tweets, etc.).
- Submit button triggers the fact-check pipeline.
- Character limit: 500 characters.

#### F2: AI-Powered Fact-Check (RAG Pipeline)
- Backend searches verified government databases using Tavily/Google CSE.
- Search is restricted to `.gov.in` domains (PIB, ECI, MyGov).
- Gemini API analyzes the claim against retrieved evidence.
- Returns a structured verdict: `verified`, `false`, or `unverified`.

#### F3: Traffic Light Verdict Card
- Displays the result using a clear, visual "Traffic Light" system:
  - ✅ **Green** — Verified (claim is true)
  - 🚩 **Red** — False/Fake (claim is debunked)
  - ⚠️ **Yellow** — Unverified (insufficient evidence)
- Includes a **2-sentence plain-language explanation**.
- Shows a **confidence score** (percentage bar).
- Lists **source links** to official government pages.

#### F4: Source Transparency
- Every verdict card includes clickable links to the exact government documents.
- Sources are displayed with title + URL.
- Users can independently verify the AI's verdict.

#### F5: Trending Misinformation Dashboard
- Real-time list of recently checked claims.
- Powered by Firestore real-time subscriptions.
- Shows claim text, verdict, and timestamp.
- Helps users discover what misinformation is currently circulating.

---

### 5.2 Post-MVP Features (P1 / P2)

| Feature                        | Priority | Description                                       |
|--------------------------------|----------|---------------------------------------------------|
| Multi-language support         | P1       | Hindi, Tamil, Telugu, Bengali translations         |
| WhatsApp Bot                   | P1       | Verify claims directly inside WhatsApp             |
| Telegram Bot                   | P1       | Verify claims directly inside Telegram             |
| Browser Extension              | P2       | Flag suspicious claims while browsing social media |
| Share Verdict Image            | P1       | Generate shareable verdict card as image/link      |
| User Accounts                  | P2       | Save history, track verified claims                |
| Admin Dashboard                | P2       | Moderate verdicts, review edge cases               |
| Voice Input                    | P2       | Speak a claim instead of typing                    |
| Regional News Feed             | P2       | State-specific trending misinformation             |

---

## 6. User Flows

### 6.1 Primary Flow — Fact-Check a Claim

```
┌──────────────────────────────────────────────────────┐
│  1. User opens Trust_Lens                            │
│  2. Pastes a suspicious claim into the input box     │
│  3. Clicks "Check This Claim"                        │
│  4. Loading spinner appears (~5-10 seconds)          │
│  5. Verdict Card appears:                            │
│     ├── Traffic Light icon (✅ / 🚩 / ⚠️)           │
│     ├── 2-sentence explanation                       │
│     ├── Confidence bar                               │
│     └── Source links                                 │
│  6. User clicks source link → opens .gov.in page    │
└──────────────────────────────────────────────────────┘
```

### 6.2 Secondary Flow — Explore Trending Misinfo

```
┌──────────────────────────────────────────────────────┐
│  1. User scrolls to "Trending" section               │
│  2. Sees real-time list of recent claims              │
│  3. Clicks on any claim to view its full verdict      │
└──────────────────────────────────────────────────────┘
```

---

## 7. Design Principles

1. **Trust First:** Every AI verdict must be transparent and traceable to a source.
2. **Simplicity:** A 10th-grade student should understand the verdict without any help.
3. **Speed:** Users expect near-instant results; latency > 15s is unacceptable.
4. **Mobile-First:** 80%+ of Indian internet users are mobile-only.
5. **Accessibility:** High-contrast colors, large text, minimal reading required.
6. **No Account Required:** Zero friction to use — no login, no signup.

---

## 8. Non-Functional Requirements

| Requirement       | Specification                                            |
|-------------------|----------------------------------------------------------|
| Availability      | 99.5% uptime                                             |
| Latency           | < 10 seconds end-to-end                                  |
| Security          | No PII collection; HTTPS only; API keys in env vars      |
| Scalability       | Handle 1000 concurrent users at growth phase              |
| Browser Support   | Chrome, Safari, Firefox (latest 2 versions)               |
| Mobile Support    | Responsive down to 320px width                            |
| Accessibility     | WCAG 2.1 AA compliance (target)                           |

---

## 9. Risks & Mitigations

| Risk                                   | Impact    | Mitigation                                              |
|----------------------------------------|-----------|---------------------------------------------------------|
| Gemini API rate limits / outage        | High      | Implement caching; show "try again" with grace          |
| Search API returns irrelevant results  | Medium    | Fine-tune search queries; add domain whitelist          |
| LLM gives overconfident wrong verdict  | High      | Always show sources; add "This is AI-generated" disclaimer |
| User submits non-English claims        | Medium    | Post-MVP: add translation layer; MVP: English only      |
| Firestore costs at scale               | Medium    | Implement query deduplication; TTL for old records       |

---

## 10. Launch Plan

| Phase          | Timeline   | Milestone                                     |
|----------------|------------|-----------------------------------------------|
| Internal Alpha | Week 1     | Core RAG pipeline + basic UI functional        |
| Beta (friends) | Week 2     | Full UI + trending board; test with 20 claims  |
| Public Launch  | Week 3     | Deploy to Vercel/Firebase; share on social     |
| Iteration      | Week 4+    | Collect feedback; add P1 features              |

---

*Document Version: 1.0 — March 2026*
