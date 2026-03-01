# Trust_Lens — Environment & DevOps

## 1. Overview

This document defines the development, staging, and production environments for Trust_Lens, along with CI/CD strategy, deployment workflows, and operational procedures.

---

## 2. Environment Matrix

| Environment  | Purpose                 | URL                              | Branch   |
|-------------|-------------------------|----------------------------------|----------|
| Local Dev    | Active development       | `http://localhost:5173` (FE)     | `feature/*` |
|              |                         | `http://localhost:3001` (BE)     |          |
| Staging      | Pre-production testing   | `https://staging.trustlens.vercel.app` | `develop` |
| Production   | Live public access       | `https://trustlens.vercel.app`   | `main`   |

---

## 3. Local Development Setup

### 3.1 Prerequisites

| Tool     | Version   | Install Command                    |
|----------|-----------|------------------------------------|
| Node.js  | 18+ LTS   | [nodejs.org](https://nodejs.org)   |
| npm      | 9+        | Comes with Node.js                 |
| Git      | 2.40+     | [git-scm.com](https://git-scm.com)|

### 3.2 First-Time Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/trust-lens.git
cd trust-lens

# 2. Install all dependencies (workspaces)
npm install

# 3. Set up environment variables
cp .env.example .env
cp backend/.env.example backend/.env

# 4. Edit .env files with your API keys
# GEMINI_API_KEY=...
# TAVILY_API_KEY=...
# FIREBASE_PROJECT_ID=...

# 5. Start development servers
npm run dev
```

### 3.3 Development Scripts

| Command                    | Description                          |
|----------------------------|--------------------------------------|
| `npm run dev`              | Start both frontend + backend        |
| `npm run dev:frontend`     | Start frontend only (Vite, :5173)    |
| `npm run dev:backend`      | Start backend only (nodemon, :3001)  |
| `npm run build`            | Build frontend for production        |
| `npm run test`             | Run all tests (frontend + backend)   |
| `npm run lint`             | Lint all files with ESLint           |
| `npm run seed`             | Seed Firestore with test data        |
| `npm run clean`            | Remove build artifacts + node_modules|

---

## 4. Environment Variables

### 4.1 Backend Variables

```env
# ═══════════════════════════════════════════
# Trust_Lens Backend Environment Variables
# ═══════════════════════════════════════════

# ── Server ──────────────────────────────
PORT=3001
NODE_ENV=development                    # development | staging | production

# ── Google Gemini API ───────────────────
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-pro                 # Model name
GEMINI_TEMPERATURE=0.1                  # Low temperature for consistency

# ── Tavily Search API ──────────────────
TAVILY_API_KEY=your_tavily_api_key

# ── Google Custom Search ────────────────
GOOGLE_CSE_API_KEY=your_google_cse_key
GOOGLE_CSE_CX=your_search_engine_id     # Restricted to .gov.in

# ── Firebase ────────────────────────────
FIREBASE_PROJECT_ID=trust-lens-prod
FIREBASE_CLIENT_EMAIL=firebase-admin@trust-lens.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# ── Cache ───────────────────────────────
CACHE_TTL_MINUTES=60                    # In-memory cache TTL
CACHE_MAX_ENTRIES=1000                  # Max cached verdicts

# ── Rate Limiting ───────────────────────
RATE_LIMIT_WINDOW_MS=60000              # 1 minute window
RATE_LIMIT_MAX_REQUESTS=20             # 20 requests per window

# ── CORS ────────────────────────────────
CORS_ORIGIN=http://localhost:5173       # Comma-separated origins
```

### 4.2 Frontend Variables

```env
# ═══════════════════════════════════════════
# Trust_Lens Frontend Environment Variables
# ═══════════════════════════════════════════

VITE_API_BASE_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=trust-lens.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=trust-lens-prod
```

### 4.3 Environment-Specific Overrides

| Variable            | Local Dev               | Staging                  | Production              |
|---------------------|-------------------------|--------------------------|-------------------------|
| `NODE_ENV`          | `development`           | `staging`                | `production`            |
| `PORT`              | `3001`                  | `8080`                   | `8080`                  |
| `CORS_ORIGIN`       | `localhost:5173`        | `staging.trustlens.*`    | `trustlens.vercel.app`  |
| `CACHE_TTL_MINUTES` | `5`                     | `30`                     | `60`                    |
| `RATE_LIMIT_MAX`    | `100`                   | `30`                     | `20`                    |

---

## 5. Git Branching Strategy

### 5.1 Branch Model

```
main (production)
 │
 └── develop (staging)
      │
      ├── feature/claim-input
      ├── feature/rag-pipeline
      ├── feature/verdict-card
      ├── fix/search-fallback
      └── docs/api-contract
```

### 5.2 Branch Naming Conventions

| Prefix       | Purpose                  | Example                      |
|-------------|--------------------------|------------------------------|
| `feature/`   | New feature               | `feature/trending-board`    |
| `fix/`       | Bug fix                   | `fix/cache-ttl-bug`        |
| `docs/`      | Documentation             | `docs/update-readme`       |
| `refactor/`  | Code refactoring          | `refactor/rag-chain`       |
| `test/`      | Adding/fixing tests       | `test/scoring-engine`      |

### 5.3 Merge Flow

```
feature/* ──PR──▶ develop ──PR──▶ main
                  (staging)       (production)
```

- All merges via **Pull Request** (PR).
- PR requires passing tests (once CI is set up).
- `main` deployments are manual (MVP) / automated (growth).

---

## 6. Deployment Procedures

### 6.1 Frontend Deployment (Vercel)

```bash
# Option A: Via Vercel CLI
npm install -g vercel
cd frontend
vercel --prod

# Option B: Git-based (auto-deploy on push to main)
# Configure in Vercel dashboard:
#   Root: frontend/
#   Build: npm run build
#   Output: dist/
```

**Vercel Configuration (vercel.json):**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 6.2 Backend Deployment (Google Cloud Run)

```bash
# 1. Build Docker image
docker build -t trust-lens-backend ./backend

# 2. Tag for Container Registry
docker tag trust-lens-backend gcr.io/trust-lens-prod/backend:latest

# 3. Push to registry
docker push gcr.io/trust-lens-prod/backend:latest

# 4. Deploy to Cloud Run
gcloud run deploy trust-lens-backend \
  --image gcr.io/trust-lens-prod/backend:latest \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production" \
  --memory 512Mi \
  --concurrency 80 \
  --max-instances 10
```

**Backend Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY src/ ./src/

EXPOSE 8080

CMD ["node", "src/server.js"]
```

### 6.3 Firebase Deployment

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes
```

---

## 7. CI/CD Pipeline (Post-MVP)

### 7.1 GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run test

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm -w frontend run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm -w frontend run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
```

---

## 8. Monitoring & Logging

### 8.1 Application Logging

| Log Level | When to Use                              | Example                          |
|-----------|------------------------------------------|----------------------------------|
| `error`   | Unrecoverable failures                   | Gemini API key invalid           |
| `warn`    | Recoverable issues                       | Tavily API failed, using fallback|
| `info`    | Normal operations                        | Verdict generated, took 5200ms   |
| `debug`   | Development debugging                    | Retrieved 7 documents from search|

**Log Format (Structured JSON):**

```json
{
  "level": "info",
  "timestamp": "2026-03-01T12:00:00Z",
  "message": "Verdict generated",
  "data": {
    "claimHash": "a1b2c3d4",
    "verdict": "false",
    "confidence": 0.92,
    "processingTimeMs": 5200,
    "searchProvider": "tavily",
    "cached": false
  }
}
```

### 8.2 Health Monitoring

| Check              | Tool                  | Frequency  | Alert Threshold     |
|--------------------|-----------------------|------------|---------------------|
| API uptime         | UptimeRobot (free)    | 5 minutes  | 2 failures = alert  |
| Response latency   | Custom middleware      | Every req  | p95 > 15 seconds    |
| Error rate         | Server logs           | Aggregated | > 5% of requests    |
| API usage          | Counter middleware     | Hourly     | > 80% of quota      |

---

## 9. Secret Management

### 9.1 MVP (Simple)

| Location            | Secrets                    | Method                  |
|---------------------|----------------------------|-------------------------|
| Local dev           | API keys, Firebase creds    | `.env` file (gitignored)|
| Vercel              | All production secrets      | Vercel Environment Vars |
| Cloud Run           | All production secrets      | GCP Secret Manager      |

### 9.2 Rules

1. **NEVER** commit `.env` files to Git.
2. **ALWAYS** commit `.env.example` with placeholder values.
3. **ROTATE** API keys if accidentally exposed.
4. **LIMIT** API key permissions to minimum required scope.

---

## 10. Disaster Recovery

| Scenario                    | Recovery Procedure                              | RTO     |
|-----------------------------|------------------------------------------------|---------|
| Frontend down (Vercel)      | Vercel auto-recovers; redeploy if needed        | < 5 min |
| Backend down (Cloud Run)    | Auto-restarts; check env vars; redeploy         | < 10 min|
| Firestore data corruption   | Restore from automatic backups                  | < 1 hr  |
| API key compromised         | Rotate key; update env vars; redeploy           | < 30 min|
| Full outage                 | Redeploy all from `main` branch                 | < 30 min|

---

*Document Version: 1.0 — March 2026*
