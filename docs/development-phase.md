# Trust_Lens — Development Phases

## 1. Overview

This document breaks the Trust_Lens MVP build into well-defined development phases with clear deliverables, timelines, and dependencies. Each phase builds upon the previous one, ensuring a stable, incremental delivery.

**Total Estimated Duration:** 5 working days (2 developers)

---

## 2. Phase Summary

```
Phase 0        Phase 1           Phase 2           Phase 3           Phase 4         Phase 5
 Setup     │    Backend Core   │   Frontend UI    │  Integration    │   Polish      │  Deploy
 (Day 1)   │    (Day 1–2)      │   (Day 2–3)      │   (Day 3)       │  (Day 4)      │ (Day 5)
───────────┼──────────────────┼──────────────────┼─────────────────┼───────────────┼──────────
 Repo init │  RAG pipeline    │  Claim input     │  Frontend ↔    │  Error states │ Vercel
 Packages  │  Search tools    │  Verdict card    │  Backend wired  │  Edge cases  │ Cloud Run
 Env vars  │  Gemini API      │  Trending board  │  Firestore live │  Mobile test │ Firestore
 Firebase  │  Express APIs    │  Layout/Header   │  E2E manual     │  Copy/UX     │ DNS
           │  Firestore       │  Loading states  │  test           │  Performance │ Smoke test
```

---

## 3. Phase 0: Project Setup (Day 1, Morning)

**Goal:** Initialize the monorepo, install dependencies, configure tooling.

**Duration:** ~4 hours

### Tasks

| #  | Task                                        | Effort  | Status |
|----|---------------------------------------------|---------|--------|
| 0.1| Create Git repository, add `.gitignore`     | 15 min  | ⬜     |
| 0.2| Initialize root `package.json` with workspaces | 15 min | ⬜  |
| 0.3| Set up `frontend/` with Vite + React         | 30 min  | ⬜     |
| 0.4| Configure Tailwind CSS in frontend           | 30 min  | ⬜     |
| 0.5| Set up `backend/` with Express + nodemon     | 30 min  | ⬜     |
| 0.6| Create `shared/` workspace with types        | 15 min  | ⬜     |
| 0.7| Create `.env.example` files                  | 15 min  | ⬜     |
| 0.8| Set up Firebase project + Firestore          | 30 min  | ⬜     |
| 0.9| Configure Firestore security rules           | 15 min  | ⬜     |
| 0.10| Verify `npm run dev` works (both workspaces)| 15 min  | ⬜     |

### Deliverables
- [ ] Monorepo running locally (frontend on `:5173`, backend on `:3001`)
- [ ] Both `npm run dev:frontend` and `npm run dev:backend` succeed
- [ ] Firebase project configured with empty Firestore

### Exit Criteria
- `GET /api/health` returns `{"status":"ok"}`
- Frontend shows Vite + React default page

---

## 4. Phase 1: Backend Core — RAG Pipeline (Day 1–2)

**Goal:** Build the complete RAG fact-checking pipeline and API endpoints.

**Duration:** ~16 hours

### Tasks

| #  | Task                                         | Effort  | Depends On | Status |
|----|----------------------------------------------|---------|------------|--------|
| 1.1| Implement Tavily API search tool             | 3 hrs   | 0.x        | ⬜     |
| 1.2| Implement Google CSE search tool             | 3 hrs   | 0.x        | ⬜     |
| 1.3| Build search orchestrator (parallel + fallback)| 2 hrs | 1.1, 1.2   | ⬜     |
| 1.4| Write prompt templates                       | 2 hrs   | —          | ⬜     |
| 1.5| Build LangChain.js RAG chain                 | 4 hrs   | 1.3, 1.4   | ⬜     |
| 1.6| Implement response parser + validator        | 1 hr    | 1.5        | ⬜     |
| 1.7| Implement scoring engine                     | 3 hrs   | 1.6        | ⬜     |
| 1.8| Build `POST /api/fact-check` endpoint         | 2 hrs   | 1.5, 1.7   | ⬜     |
| 1.9| Implement claim normalization + caching       | 1.5 hrs | 1.8        | ⬜     |
| 1.10| Firestore write (verdicts + trending)       | 2 hrs   | 1.8        | ⬜     |
| 1.11| Implement middleware stack (CORS, rate limit, sanitize)| 2 hrs | 0.x | ⬜ |
| 1.12| Build `GET /api/trending` endpoint           | 1.5 hrs | 1.10       | ⬜     |
| 1.13| Build `GET /api/stats` endpoint              | 1 hr    | 1.10       | ⬜     |
| 1.14| Test pipeline with 5 sample claims           | 2 hrs   | 1.8        | ⬜     |

### Deliverables
- [ ] `POST /api/fact-check` returns accurate verdicts with sources
- [ ] `GET /api/trending` returns recent verdicts from Firestore
- [ ] `GET /api/health` shows service health
- [ ] Search fallback works (Tavily → Google CSE)
- [ ] Rate limiting enforced

### Exit Criteria
- Tested with 5 real claims (3 false, 2 verified)
- All verdicts include source URLs from `.gov.in`
- Response time < 12 seconds

---

## 5. Phase 2: Frontend UI (Day 2–3)

**Goal:** Build all user-facing React components with Tailwind styling.

**Duration:** ~14 hours

### Tasks

| #  | Task                                         | Effort  | Depends On | Status |
|----|----------------------------------------------|---------|------------|--------|
| 2.1| Design global styles + color palette         | 1 hr    | 0.x        | ⬜     |
| 2.2| Build `Header` + `Footer` components         | 2 hrs   | 2.1        | ⬜     |
| 2.3| Build `ClaimInput` component                  | 3 hrs   | 2.1        | ⬜     |
| 2.4| Build `VerdictCard` component                 | 3 hrs   | 2.1        | ⬜     |
| 2.5| Build `ConfidenceBar` sub-component           | 1 hr    | 2.4        | ⬜     |
| 2.6| Build `SourceList` sub-component              | 1 hr    | 2.4        | ⬜     |
| 2.7| Build `LoadingSpinner` / skeleton card        | 1 hr    | 2.1        | ⬜     |
| 2.8| Build `ErrorBanner` + retry button            | 1.5 hrs | 2.1        | ⬜     |
| 2.9| Build `TrendingBoard` + `TrendingItem`        | 3 hrs   | 2.1        | ⬜     |
| 2.10| Build `AboutModal`                           | 1.5 hrs | 2.1        | ⬜     |
| 2.11| Compose `Home` page layout                  | 1 hr    | 2.2–2.10   | ⬜     |
| 2.12| Build API service layer (`api.js`)           | 1 hr    | —          | ⬜     |
| 2.13| Build Firebase service (`firebase.js`)       | 1 hr    | —          | ⬜     |

### Deliverables
- [ ] All components render with mock data
- [ ] Layout is responsive (320px – 1920px)
- [ ] Traffic light verdict card works visually

### Exit Criteria
- UI looks polished on both mobile and desktop
- All components render without console errors

---

## 6. Phase 3: Integration (Day 3)

**Goal:** Connect frontend to backend; wire up Firestore real-time for trending.

**Duration:** ~6 hours

### Tasks

| #  | Task                                         | Effort  | Depends On | Status |
|----|----------------------------------------------|---------|------------|--------|
| 3.1| Wire `ClaimInput` → `POST /api/fact-check`   | 2 hrs   | 1.8, 2.3   | ⬜     |
| 3.2| Wire `VerdictCard` to API response            | 1.5 hrs | 1.8, 2.4   | ⬜     |
| 3.3| Wire `TrendingBoard` to Firestore onSnapshot  | 2 hrs   | 1.10, 2.9  | ⬜     |
| 3.4| Handle loading + error states end-to-end      | 1.5 hrs | 3.1, 3.2   | ⬜     |
| 3.5| Full manual E2E test (5 claims)               | 1 hr    | 3.1–3.4    | ⬜     |

### Deliverables
- [ ] User can submit a claim and see a real verdict
- [ ] Trending board updates in real-time
- [ ] Error states display correctly

### Exit Criteria
- Full flow works: paste claim → loading → verdict card → sources → trending

---

## 7. Phase 4: Polish & Test (Day 4)

**Goal:** Handle edge cases, improve UX, fix bugs, write tests.

**Duration:** ~10 hours

### Tasks

| #  | Task                                         | Effort  | Depends On | Status |
|----|----------------------------------------------|---------|------------|--------|
| 4.1| Handle edge cases (empty, too long, special chars)| 2 hrs| 3.x       | ⬜     |
| 4.2| Mobile responsiveness testing & fixes        | 2 hrs   | 3.x        | ⬜     |
| 4.3| Cross-browser testing (Chrome, Firefox, Safari)| 1 hr  | 3.x        | ⬜     |
| 4.4| UX copy review + improvements               | 1 hr    | 3.x        | ⬜     |
| 4.5| Write backend unit tests                     | 3 hrs   | 1.x        | ⬜     |
| 4.6| Write frontend component tests               | 2 hrs   | 2.x        | ⬜     |
| 4.7| Prompt accuracy testing (20 claims dataset)  | 2 hrs   | 1.x        | ⬜     |
| 4.8| Performance check (LCP, latency)             | 1 hr    | 3.x        | ⬜     |

### Deliverables
- [ ] All edge cases handled gracefully
- [ ] Tests pass (unit + integration)
- [ ] Prompt accuracy ≥ 85% on test dataset

### Exit Criteria
- No critical bugs
- `npm test` passes in both workspaces

---

## 8. Phase 5: Deployment (Day 5)

**Goal:** Deploy to production, smoke test, prepare for demo.

**Duration:** ~5 hours

### Tasks

| #  | Task                                         | Effort  | Depends On | Status |
|----|----------------------------------------------|---------|------------|--------|
| 5.1| Build frontend for production (`npm run build`)| 30 min| 4.x        | ⬜     |
| 5.2| Deploy frontend to Vercel / Firebase Hosting | 1 hr    | 5.1        | ⬜     |
| 5.3| Deploy backend to Cloud Run / Vercel Functions| 2 hrs  | 5.1        | ⬜     |
| 5.4| Configure environment variables in production| 30 min  | 5.2, 5.3   | ⬜     |
| 5.5| Firestore security rules deploy              | 15 min  | 5.3        | ⬜     |
| 5.6| Production smoke test (3 claims)             | 30 min  | 5.4        | ⬜     |
| 5.7| Write/update README with setup instructions  | 30 min  | 5.6        | ⬜     |
| 5.8| Prepare demo script (3 compelling claims)    | 30 min  | 5.6        | ⬜     |

### Deliverables
- [ ] Application live on public URL
- [ ] All APIs working in production
- [ ] README with quick-start instructions

### Exit Criteria
- Application accessible via public URL
- Demo script tested and working

---

## 9. Phase Dependency Graph

```
Phase 0 (Setup)
  │
  ├──▶ Phase 1 (Backend Core)
  │         │
  │         ├──▶ Phase 3 (Integration) ──▶ Phase 4 (Polish) ──▶ Phase 5 (Deploy)
  │         │         ▲
  ├──▶ Phase 2 (Frontend UI)
               │
               └──────┘
```

**Parallelizable:** Phase 1 (Backend) and Phase 2 (Frontend) can be developed simultaneously by two developers after Phase 0 is complete.

---

## 10. Risk Checkpoints

| After Phase | Check                                        | Action if Failed                  |
|-------------|----------------------------------------------|-----------------------------------|
| Phase 0     | Can both servers start?                      | Fix config before continuing      |
| Phase 1     | Does RAG pipeline return valid verdicts?      | Debug search/LLM before frontend  |
| Phase 2     | Do all components render on mobile?           | Fix responsive issues             |
| Phase 3     | Does full E2E flow work?                     | Debug integration before polish   |
| Phase 4     | Is prompt accuracy ≥ 85%?                    | Adjust prompt template            |
| Phase 5     | Does prod smoke test pass?                   | Fix env config; rollback if needed|

---

*Document Version: 1.0 — March 2026*
