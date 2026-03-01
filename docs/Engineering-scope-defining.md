# Trust_Lens — Engineering Scope Definition

## 1. Purpose

This document defines the engineering scope, boundaries, and responsibilities for the Trust_Lens MVP. It clarifies what will be built, what is explicitly out of scope, technical ownership, and effort estimates to align all stakeholders.

---

## 2. Project Scope Summary

| Dimension       | In Scope                                                      | Out of Scope                              |
|-----------------|---------------------------------------------------------------|-------------------------------------------|
| **Platform**    | Web application (responsive SPA)                              | Native apps (iOS, Android), PWA           |
| **Language**    | English only                                                  | Hindi, Tamil, Telugu, Bengali, etc.       |
| **Auth**        | Anonymous usage (no accounts)                                 | User registration, login, profiles        |
| **AI Model**    | Google Gemini API (cloud-hosted)                              | Self-hosted LLMs, fine-tuning             |
| **Search**      | Tavily API + Google CSE (.gov.in)                             | Custom web crawler, manual curation       |
| **Database**    | Firebase Firestore                                            | PostgreSQL, MongoDB, custom DB            |
| **Deployment**  | Vercel / Firebase Hosting                                     | AWS, Azure, bare metal                    |
| **Testing**     | Unit + integration + manual prompt testing                    | Automated E2E (Cypress), load testing     |
| **Bots**        | —                                                             | WhatsApp, Telegram, Slack bots            |
| **Analytics**   | Basic trending dashboard + daily counters                     | Advanced ML analytics, admin dashboards   |

---

## 3. Technical Scope by Module

### 3.1 Frontend Engineering Scope

| Feature                        | Status   | Effort  | Owner        |
|--------------------------------|----------|---------|--------------|
| Project setup (Vite + React)   | ✅ Scope | 2 hrs   | Frontend Dev |
| Tailwind CSS configuration     | ✅ Scope | 1 hr    | Frontend Dev |
| `ClaimInput` component          | ✅ Scope | 3 hrs   | Frontend Dev |
| `VerdictCard` component         | ✅ Scope | 4 hrs   | Frontend Dev |
| `ConfidenceBar` component       | ✅ Scope | 2 hrs   | Frontend Dev |
| `SourceList` component          | ✅ Scope | 2 hrs   | Frontend Dev |
| `TrendingBoard` component       | ✅ Scope | 4 hrs   | Frontend Dev |
| `Header` + `Footer` layout      | ✅ Scope | 2 hrs   | Frontend Dev |
| `LoadingSpinner` + skeleton     | ✅ Scope | 1 hr    | Frontend Dev |
| `ErrorBanner` + retry logic     | ✅ Scope | 2 hrs   | Frontend Dev |
| About/How-it-works modal       | ✅ Scope | 2 hrs   | Frontend Dev |
| Mobile responsive design       | ✅ Scope | 3 hrs   | Frontend Dev |
| Firestore real-time listener    | ✅ Scope | 3 hrs   | Frontend Dev |
| API service layer (fetch/axios)| ✅ Scope | 2 hrs   | Frontend Dev |
| Dark mode                      | ❌ Out   | —       | —            |
| Animations (Framer Motion)     | ❌ Out   | —       | —            |
| Internationalization (i18n)    | ❌ Out   | —       | —            |
| State management (Redux/Zustand)| ❌ Out  | —       | —            |

**Frontend Total Estimated Effort:** ~30 hours

---

### 3.2 Backend Engineering Scope

| Feature                            | Status   | Effort  | Owner         |
|------------------------------------|----------|---------|---------------|
| Project setup (Express + Node)     | ✅ Scope | 2 hrs   | Backend Dev   |
| `POST /api/fact-check` endpoint     | ✅ Scope | 4 hrs   | Backend Dev   |
| `GET /api/trending` endpoint        | ✅ Scope | 2 hrs   | Backend Dev   |
| `GET /api/health` endpoint          | ✅ Scope | 1 hr    | Backend Dev   |
| `GET /api/stats` endpoint           | ✅ Scope | 2 hrs   | Backend Dev   |
| LangChain.js RAG chain setup       | ✅ Scope | 6 hrs   | Backend Dev   |
| Tavily API integration             | ✅ Scope | 3 hrs   | Backend Dev   |
| Google CSE integration             | ✅ Scope | 3 hrs   | Backend Dev   |
| Search fallback logic              | ✅ Scope | 2 hrs   | Backend Dev   |
| Gemini API integration             | ✅ Scope | 3 hrs   | Backend Dev   |
| Prompt template engineering        | ✅ Scope | 4 hrs   | Backend Dev   |
| Response parsing & validation      | ✅ Scope | 2 hrs   | Backend Dev   |
| Scoring engine implementation      | ✅ Scope | 6 hrs   | Backend Dev   |
| In-memory caching                  | ✅ Scope | 2 hrs   | Backend Dev   |
| Claim normalization + hashing      | ✅ Scope | 1 hr    | Backend Dev   |
| Firestore write (verdicts)         | ✅ Scope | 2 hrs   | Backend Dev   |
| Firestore write (trending)         | ✅ Scope | 1 hr    | Backend Dev   |
| Analytics counter updates          | ✅ Scope | 1 hr    | Backend Dev   |
| CORS middleware                    | ✅ Scope | 0.5 hr  | Backend Dev   |
| Rate limiting middleware           | ✅ Scope | 1 hr    | Backend Dev   |
| Input sanitization middleware      | ✅ Scope | 1 hr    | Backend Dev   |
| Global error handler              | ✅ Scope | 1 hr    | Backend Dev   |
| Redis caching                     | ❌ Out   | —       | —             |
| WebSocket endpoints               | ❌ Out   | —       | —             |
| Background job queue               | ❌ Out   | —       | —             |
| User authentication                | ❌ Out   | —       | —             |
| File upload handling               | ❌ Out   | —       | —             |

**Backend Total Estimated Effort:** ~47 hours

---

### 3.3 DevOps & Infrastructure Scope

| Feature                            | Status   | Effort  | Owner    |
|------------------------------------|----------|---------|----------|
| Git repository setup               | ✅ Scope | 0.5 hr  | DevOps   |
| Environment variable management    | ✅ Scope | 1 hr    | DevOps   |
| Frontend deployment (Vercel)       | ✅ Scope | 1 hr    | DevOps   |
| Backend deployment (Cloud Run)     | ✅ Scope | 2 hrs   | DevOps   |
| Firebase project setup             | ✅ Scope | 1 hr    | DevOps   |
| Firestore security rules           | ✅ Scope | 1 hr    | DevOps   |
| DNS + custom domain               | ❌ Out   | —       | —        |
| CI/CD pipeline (GitHub Actions)    | ❌ Out   | —       | —        |
| Monitoring / alerting              | ❌ Out   | —       | —        |
| SSL certificate management        | ❌ Out   | —       | —        |

**DevOps Total Estimated Effort:** ~6.5 hours

---

### 3.4 Testing Scope

| Feature                            | Status   | Effort  | Owner    |
|------------------------------------|----------|---------|----------|
| Backend unit tests (Jest)          | ✅ Scope | 4 hrs   | QA/Dev   |
| API integration tests (Supertest)  | ✅ Scope | 3 hrs   | QA/Dev   |
| Frontend component tests (Vitest)  | ✅ Scope | 3 hrs   | QA/Dev   |
| Prompt accuracy testing (20 claims)| ✅ Scope | 3 hrs   | QA/Dev   |
| Manual cross-browser testing       | ✅ Scope | 2 hrs   | QA/Dev   |
| E2E tests (Cypress/Playwright)     | ❌ Out   | —       | —        |
| Performance / load testing         | ❌ Out   | —       | —        |
| Security penetration testing       | ❌ Out   | —       | —        |

**Testing Total Estimated Effort:** ~15 hours

---

## 4. Total Effort Estimate

| Module       | Hours   | % of Total |
|-------------|---------|------------|
| Frontend     | 30      | 30%        |
| Backend      | 47      | 48%        |
| DevOps       | 6.5     | 7%         |
| Testing      | 15      | 15%        |
| **Total**    | **98.5**| **100%**   |

**Estimated Timeline:** 5 days (2 developers working full-time)

---

## 5. Technical Risks & Mitigations

| Risk                                | Probability | Impact | Mitigation                                   |
|-------------------------------------|-------------|--------|----------------------------------------------|
| Gemini API free tier limits hit     | Medium      | High   | Implement caching aggressively; upgrade plan  |
| Tavily search quality insufficient  | Medium      | Medium | Fine-tune queries; use Google CSE as primary  |
| LLM gives wrong verdicts            | Medium      | High   | Always show sources; add "AI-generated" warning |
| Firestore free tier exceeded        | Low         | Medium | Deduplicate claims; TTL cleanup              |
| Team velocity lower than estimated  | Medium      | Medium | Prioritize P0 features; cut trending dashboard |

---

## 6. Definition of Done (DoD)

A feature is considered "done" when:

- [ ] Code is written and follows project conventions
- [ ] Code is peer-reviewed (or self-reviewed for solo dev)
- [ ] Unit/integration tests pass
- [ ] Feature works on mobile and desktop
- [ ] No console errors or warnings
- [ ] Edge cases are handled (empty input, API failure, etc.)
- [ ] Code is merged to `main` branch
- [ ] Feature is deployed to staging/production

---

## 7. Scope Change Process

Any scope change (adding or removing features) must follow this process:

1. **Identify:** Document the proposed change and its impact.
2. **Assess:** Estimate effort, timeline, and dependency impact.
3. **Decide:** Team lead approves/rejects based on MVP timeline.
4. **Update:** If approved, update this document and the `development-phase.md` timeline.

---

*Document Version: 1.0 — March 2026*
