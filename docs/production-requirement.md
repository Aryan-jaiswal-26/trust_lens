# Trust_Lens — Production Requirements

## 1. Product Overview

**Product:** Trust_Lens — Real-Time AI Fact-Checking Engine for Indian Government Claims
**Release Target:** MVP v1.0
**Date:** March 2026

Trust_Lens allows citizens to paste a suspicious claim about an Indian government scheme or election and receive an instant, AI-generated verdict backed by official government sources.

---

## 2. Business Requirements

### 2.1 Business Objectives

| ID    | Objective                                                              | Priority |
|-------|------------------------------------------------------------------------|----------|
| BR-01 | Combat misinformation about government schemes in real-time            | P0       |
| BR-02 | Provide source-backed verdicts to build user trust                     | P0       |
| BR-03 | Make fact-checking accessible to all literacy levels                   | P0       |
| BR-04 | Surface trending misinformation patterns for public awareness          | P1       |
| BR-05 | Operate with minimal infrastructure cost for sustainability            | P1       |

### 2.2 Business Success Criteria

| Metric                        | MVP Target             | Growth Target         |
|-------------------------------|------------------------|-----------------------|
| Daily Active Queries          | 100+                   | 10,000+               |
| Verdict Accuracy              | ≥ 85%                  | ≥ 92%                 |
| Average Response Time         | < 10 seconds           | < 5 seconds           |
| Source Citation Rate           | 100%                   | 100%                  |
| Monthly API Cost              | < $50                  | < $500                |

---

## 3. Functional Requirements

### 3.1 Claim Submission (FR-100)

| ID      | Requirement                                                          | Priority |
|---------|----------------------------------------------------------------------|----------|
| FR-101  | User shall input a claim via a text field (max 500 chars)            | P0       |
| FR-102  | System shall accept free-text claims (WhatsApp forwards, tweets)     | P0       |
| FR-103  | System shall display a loading state during processing               | P0       |
| FR-104  | System shall reject empty or whitespace-only submissions             | P0       |
| FR-105  | System shall auto-trim leading/trailing whitespace                   | P1       |

### 3.2 RAG Fact-Check Pipeline (FR-200)

| ID      | Requirement                                                          | Priority |
|---------|----------------------------------------------------------------------|----------|
| FR-201  | System shall search only `.gov.in` domains for evidence              | P0       |
| FR-202  | System shall use Tavily API as primary search provider               | P0       |
| FR-203  | System shall use Google CSE as fallback search provider              | P0       |
| FR-204  | System shall retrieve minimum 3, maximum 10 source documents         | P0       |
| FR-205  | System shall use Gemini API to generate verdicts                     | P0       |
| FR-206  | System shall set LLM temperature to ≤ 0.2 for consistency           | P0       |
| FR-207  | System shall force JSON-structured output from the LLM              | P0       |
| FR-208  | System shall never use LLM training data as a source                | P0       |

### 3.3 Verdict Display (FR-300)

| ID      | Requirement                                                          | Priority |
|---------|----------------------------------------------------------------------|----------|
| FR-301  | Verdict shall display as Traffic Light: ✅ / 🚩 / ⚠️                | P0       |
| FR-302  | Verdict card shall include a 2-sentence plain-language explanation   | P0       |
| FR-303  | Verdict card shall show a confidence score (0–100%)                  | P0       |
| FR-304  | Verdict card shall list clickable source URLs                        | P0       |
| FR-305  | Verdict card shall include a timestamp                               | P1       |
| FR-306  | Verdict card shall be shareable (copy link / screenshot)             | P2       |

### 3.4 Trending Dashboard (FR-400)

| ID      | Requirement                                                          | Priority |
|---------|----------------------------------------------------------------------|----------|
| FR-401  | Dashboard shall display recent claims in real-time                   | P1       |
| FR-402  | Each entry shall show: claim text, verdict icon, timestamp           | P1       |
| FR-403  | Dashboard shall update without page refresh (Firestore onSnapshot)   | P1       |
| FR-404  | Dashboard shall show the most recent 20 claims                      | P1       |

### 3.5 Caching (FR-500)

| ID      | Requirement                                                          | Priority |
|---------|----------------------------------------------------------------------|----------|
| FR-501  | System shall cache verdicts for identical/similar claims             | P1       |
| FR-502  | Cache TTL shall be 1 hour (MVP) / 6 hours (growth)                  | P1       |
| FR-503  | Cached results shall return in < 500ms                              | P1       |

---

## 4. Non-Functional Requirements

### 4.1 Performance (NFR-100)

| ID       | Requirement                                                         | Target         |
|----------|---------------------------------------------------------------------|----------------|
| NFR-101  | End-to-end response time                                            | < 10 seconds   |
| NFR-102  | Search retrieval latency                                            | < 3 seconds    |
| NFR-103  | LLM generation latency                                              | < 5 seconds    |
| NFR-104  | Frontend initial load (LCP)                                         | < 2 seconds    |
| NFR-105  | Time to Interactive (TTI)                                            | < 3 seconds    |

### 4.2 Scalability (NFR-200)

| ID       | Requirement                                                         | Target         |
|----------|---------------------------------------------------------------------|----------------|
| NFR-201  | MVP concurrent users                                                | 50             |
| NFR-202  | Growth concurrent users                                             | 1,000          |
| NFR-203  | Horizontal scalability via Cloud Run                                | Auto-scale     |

### 4.3 Reliability (NFR-300)

| ID       | Requirement                                                         | Target         |
|----------|---------------------------------------------------------------------|----------------|
| NFR-301  | System uptime                                                       | 99.5%          |
| NFR-302  | Graceful degradation on search API failure                          | Fallback chain |
| NFR-303  | Data persistence reliability (Firestore)                            | 99.99%         |

### 4.4 Security (NFR-400)

| ID       | Requirement                                                         |
|----------|---------------------------------------------------------------------|
| NFR-401  | All traffic over HTTPS                                              |
| NFR-402  | API keys stored in environment variables, never in source code      |
| NFR-403  | No PII collection (claims stored anonymously)                       |
| NFR-404  | Input sanitization against XSS / injection                         |
| NFR-405  | CORS whitelist restricted to frontend domain                        |
| NFR-406  | Rate limiting: 20 requests/min per IP                               |

### 4.5 Accessibility (NFR-500)

| ID       | Requirement                                                         |
|----------|---------------------------------------------------------------------|
| NFR-501  | WCAG 2.1 AA compliance                                              |
| NFR-502  | Minimum contrast ratio 4.5:1                                        |
| NFR-503  | Keyboard-navigable interface                                        |
| NFR-504  | Screen reader compatible                                            |
| NFR-505  | Responsive design (320px – 1920px)                                  |

### 4.6 Browser Compatibility (NFR-600)

| Browser          | Version Support          |
|------------------|--------------------------|
| Chrome           | Latest 2 versions        |
| Firefox          | Latest 2 versions        |
| Safari           | Latest 2 versions        |
| Edge             | Latest 2 versions        |
| Mobile Chrome    | Latest 2 versions        |
| Mobile Safari    | Latest 2 versions        |

---

## 5. Constraints

| Constraint                                | Detail                                           |
|-------------------------------------------|--------------------------------------------------|
| Budget                                    | < $50/month for MVP infrastructure               |
| API Limits (Gemini free tier)             | 60 requests/min; 1,500 requests/day              |
| API Limits (Tavily free tier)             | 1,000 searches/month                             |
| Language support (MVP)                    | English only                                     |
| No user authentication (MVP)             | Anonymous usage only                             |
| Source restriction                        | Only `.gov.in` domains                           |

---

## 6. Assumptions

1. Users will primarily access the app via mobile browsers (Android Chrome).
2. Claims will be in English (MVP).
3. Government websites (PIB, ECI, MyGov) will remain accessible and crawlable.
4. Gemini API free/starter tier will be sufficient for MVP traffic.
5. Tavily API will support domain-filtered searches.

---

## 7. Dependencies

| Dependency                    | Type       | Risk Level | Mitigation                          |
|-------------------------------|------------|------------|-------------------------------------|
| Google Gemini API             | External   | Medium     | Cache results; retry logic          |
| Tavily Search API             | External   | Medium     | Fallback to Google CSE              |
| Google Custom Search API      | External   | Low        | Secondary search provider           |
| Firebase Firestore            | External   | Low        | Google SLA; non-blocking writes     |
| `.gov.in` website availability| External   | Low        | Multiple gov domains as sources     |

---

*Document Version: 1.0 — March 2026*
