# Trust_Lens — Monorepo Structure

## 1. Overview

Trust_Lens uses a **monorepo** structure to keep the frontend, backend, shared utilities, and documentation in a single repository. This simplifies development, enables code sharing, and streamlines CI/CD.

---

## 2. Full Directory Tree

```
trust-lens/
│
├── 📄 README.md                          # Project overview & quick start
├── 📄 .gitignore                         # Git ignore rules
├── 📄 .env.example                       # Template for environment variables
├── 📄 LICENSE                            # Project license
├── 📄 package.json                       # Root package (workspaces config)
├── 📄 turbo.json                         # Turborepo config (optional)
│
├── 📁 docs/                              # All project documentation
│   ├── Architecture.md
│   ├── mvp-techdoc.md
│   ├── Prd.md
│   ├── system-design.md
│   ├── production-requirement.md
│   ├── user-stories-acceptance-criteria.md
│   ├── Information-architecture.md
│   ├── System-architecture.md
│   ├── database-schema.md
│   ├── API-contract.md
│   ├── monorepo-structure.md             # ← This file
│   ├── scoring-engine-specification.md
│   ├── Engineering-scope-defining.md
│   ├── development-phase.md
│   ├── environment-devops.md
│   └── testing-strategy.md
│
├── 📁 frontend/                          # React + Vite + Tailwind SPA
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   ├── 📄 tailwind.config.js
│   ├── 📄 postcss.config.js
│   ├── 📄 index.html
│   ├── 📁 public/
│   │   ├── favicon.ico
│   │   ├── logo.svg
│   │   └── og-image.png                  # Open Graph social preview
│   └── 📁 src/
│       ├── 📄 main.jsx                   # React entry point
│       ├── 📄 App.jsx                    # Root component
│       ├── 📄 index.css                  # Tailwind directives + globals
│       │
│       ├── 📁 components/                # Reusable UI components
│       │   ├── 📁 claim/
│       │   │   ├── ClaimInput.jsx        # Text area + submit button
│       │   │   └── ClaimInput.test.jsx
│       │   ├── 📁 verdict/
│       │   │   ├── VerdictCard.jsx       # Traffic light result card
│       │   │   ├── ConfidenceBar.jsx     # Visual confidence indicator
│       │   │   ├── SourceList.jsx        # Clickable source links
│       │   │   └── VerdictCard.test.jsx
│       │   ├── 📁 trending/
│       │   │   ├── TrendingBoard.jsx     # Real-time trending list
│       │   │   ├── TrendingItem.jsx      # Single trending entry
│       │   │   └── TrendingBoard.test.jsx
│       │   ├── 📁 layout/
│       │   │   ├── Header.jsx            # App header with logo
│       │   │   ├── Footer.jsx            # Disclaimer + credits
│       │   │   └── Container.jsx         # Max-width wrapper
│       │   ├── 📁 common/
│       │   │   ├── LoadingSpinner.jsx    # Loading state indicator
│       │   │   ├── ErrorBanner.jsx       # Error display + retry
│       │   │   └── Button.jsx            # Reusable button component
│       │   └── 📁 modals/
│       │       └── AboutModal.jsx        # How-it-works modal
│       │
│       ├── 📁 pages/
│       │   └── Home.jsx                  # Main page layout
│       │
│       ├── 📁 hooks/                     # Custom React hooks
│       │   ├── useFactCheck.js           # Fact-check API hook
│       │   ├── useTrending.js            # Firestore real-time hook
│       │   └── useDebounce.js            # Input debouncing
│       │
│       ├── 📁 services/                  # External service integrations
│       │   ├── api.js                    # Backend REST API client
│       │   └── firebase.js              # Firebase/Firestore client init
│       │
│       ├── 📁 utils/                     # Client-side utilities
│       │   ├── formatTime.js            # Relative time formatting
│       │   └── validators.js            # Client-side input validation
│       │
│       └── 📁 constants/
│           ├── verdicts.js              # Verdict type constants
│           └── config.js                # Frontend configuration
│
├── 📁 backend/                           # Node.js + Express API
│   ├── 📄 package.json
│   ├── 📄 .env.example                   # Backend-specific env template
│   ├── 📄 nodemon.json                   # Dev auto-restart config
│   └── 📁 src/
│       ├── 📄 server.js                  # Entry point (start server)
│       ├── 📄 app.js                     # Express app setup + middleware
│       │
│       ├── 📁 routes/                    # API route definitions
│       │   ├── factcheck.js             # POST /api/fact-check
│       │   ├── trending.js              # GET /api/trending
│       │   ├── health.js                # GET /api/health
│       │   └── stats.js                 # GET /api/stats
│       │
│       ├── 📁 chains/                    # LangChain.js RAG pipeline
│       │   ├── ragChain.js              # Main orchestrator chain
│       │   ├── queryGenerator.js        # Claim → search queries
│       │   ├── promptTemplates.js       # System + user prompt templates
│       │   └── responseParser.js        # Parse + validate LLM output
│       │
│       ├── 📁 tools/                     # Search tool integrations
│       │   ├── tavilySearch.js          # Tavily API wrapper
│       │   ├── googleCSE.js             # Google Custom Search wrapper
│       │   └── searchOrchestrator.js    # Parallel search + fallback
│       │
│       ├── 📁 services/                  # Business logic services
│       │   ├── firestore.js             # Firestore CRUD operations
│       │   ├── cache.js                 # In-memory / Redis cache
│       │   └── analytics.js            # Daily analytics updater
│       │
│       ├── 📁 scoring/                   # Verdict scoring engine
│       │   ├── scoringEngine.js         # Main scoring orchestrator
│       │   ├── sourceScorer.js          # Score by source authority
│       │   ├── relevanceScorer.js       # Score by keyword relevance
│       │   └── confidenceCalculator.js  # Final confidence aggregation
│       │
│       ├── 📁 middleware/                # Express middleware
│       │   ├── rateLimiter.js           # Request rate limiting
│       │   ├── inputSanitizer.js        # XSS / injection prevention
│       │   ├── errorHandler.js          # Global error handler
│       │   └── requestLogger.js         # Request/response logging
│       │
│       ├── 📁 utils/                     # Backend utilities
│       │   ├── claimNormalizer.js       # Normalize claim for cache key
│       │   ├── hashGenerator.js         # SHA-256 hashing
│       │   └── formatVerdict.js         # Structure verdict response
│       │
│       └── 📁 config/                    # Configuration
│           ├── env.js                   # Environment variable loader
│           ├── firebase.js              # Firebase Admin SDK init
│           └── constants.js             # App-wide constants
│
├── 📁 shared/                            # Shared code (frontend + backend)
│   ├── 📄 package.json
│   ├── 📁 types/
│   │   ├── verdict.js                   # Verdict type definitions
│   │   └── api.js                       # API request/response types
│   ├── 📁 constants/
│   │   ├── verdicts.js                  # Verdict enum values
│   │   └── sources.js                   # Trusted source domains list
│   └── 📁 utils/
│       └── validators.js               # Shared validation functions
│
├── 📁 firebase/                          # Firebase configuration
│   ├── 📄 firebase.json                  # Firebase project config
│   ├── 📄 .firebaserc                    # Project aliases
│   ├── 📁 firestore/
│   │   ├── firestore.rules              # Security rules
│   │   └── firestore.indexes.json       # Composite indexes
│   └── 📁 hosting/
│       └── hosting.json                 # Hosting configuration
│
├── 📁 scripts/                           # Development & deployment scripts
│   ├── seed-data.js                     # Seed Firestore with test data
│   ├── test-claims.js                   # Test RAG pipeline with sample claims
│   └── cleanup-old-verdicts.js          # TTL cleanup script
│
└── 📁 tests/                             # Integration & E2E tests
    ├── 📁 integration/
    │   ├── factcheck.test.js            # API endpoint integration tests
    │   └── trending.test.js             # Trending endpoint tests
    └── 📁 e2e/
        └── full-flow.test.js            # Full user flow test
```

---

## 3. Package Manager & Workspaces

**Package Manager:** npm (v9+)

**Root `package.json`:**

```json
{
  "name": "trust-lens",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "frontend",
    "backend",
    "shared"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "npm -w frontend run dev",
    "dev:backend": "npm -w backend run dev",
    "build": "npm -w frontend run build",
    "test": "npm -w backend run test && npm -w frontend run test",
    "lint": "eslint . --ext .js,.jsx",
    "seed": "node scripts/seed-data.js",
    "clean": "rm -rf frontend/dist backend/dist node_modules"
  },
  "devDependencies": {
    "concurrently": "^8.0.0",
    "eslint": "^8.50.0"
  }
}
```

---

## 4. Key Conventions

| Convention               | Rule                                           |
|--------------------------|------------------------------------------------|
| File naming              | `camelCase.js` for modules, `PascalCase.jsx` for components |
| Component files          | One component per file                         |
| Test files               | Co-located: `Component.test.jsx`               |
| Environment variables    | `.env.example` committed; `.env` gitignored    |
| Imports                  | Relative within package, workspace prefix across packages |
| Branch naming            | `feature/`, `fix/`, `docs/` prefixes           |

---

## 5. `.gitignore`

```gitignore
# Dependencies
node_modules/
.pnp.*

# Build outputs
frontend/dist/
backend/dist/

# Environment
.env
.env.local
.env.*.local

# Firebase
.firebase/

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Coverage
coverage/
```

---

*Document Version: 1.0 — March 2026*
