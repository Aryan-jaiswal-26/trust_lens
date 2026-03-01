# Trust_Lens — API Contract

## 1. Overview

This document defines the complete REST API contract for Trust_Lens. All endpoints are served from the Node.js/Express backend.

**Base URL:**
- Development: `http://localhost:3001`
- Production: `https://api.trustlens.in` (planned)

**Content Type:** `application/json`

---

## 2. API Summary

| Method | Endpoint             | Description                        | Auth Required |
|--------|----------------------|------------------------------------|---------------|
| POST   | `/api/fact-check`    | Submit a claim for fact-checking   | No            |
| GET    | `/api/trending`      | Get recent trending claims         | No            |
| GET    | `/api/health`        | Health check endpoint              | No            |
| GET    | `/api/stats`         | Get daily statistics               | No            |

---

## 3. Endpoints

### 3.1 `POST /api/fact-check`

Submit a claim for AI-powered fact-checking against verified government sources.

#### Request

**Headers:**

| Header         | Value              | Required |
|----------------|--------------------|----------|
| Content-Type   | application/json   | Yes      |

**Body:**

```json
{
  "claim": "string (required, max 500 chars)"
}
```

**Validation Rules:**

| Field   | Rule                    | Error Code | Error Message                    |
|---------|-------------------------|------------|----------------------------------|
| `claim` | Required                | 400        | "claim is required"              |
| `claim` | Must be a string        | 400        | "claim must be a string"         |
| `claim` | Min 10 characters       | 400        | "claim must be at least 10 characters" |
| `claim` | Max 500 characters      | 400        | "claim must not exceed 500 characters" |
| `claim` | Not only whitespace     | 400        | "claim cannot be empty"          |

#### Response — Success (200)

```json
{
  "success": true,
  "data": {
    "id": "abc123def456",
    "claim": "Government giving ₹5000 to all students through PM Digital Scheme",
    "verdict": "false",
    "confidence": 0.92,
    "explanation": "There is no 'PM Digital Scheme' offering ₹5000 to students. The PIB has officially debunked similar claims as fraudulent.",
    "sources": [
      {
        "title": "PIB Fact Check — Claim about cash transfers is FALSE",
        "url": "https://pib.gov.in/factcheck/4521",
        "domain": "pib.gov.in"
      },
      {
        "title": "MyGov — List of Active Government Schemes",
        "url": "https://www.mygov.in/schemes",
        "domain": "mygov.in"
      }
    ],
    "cached": false,
    "processingTimeMs": 6230,
    "timestamp": "2026-03-01T12:00:00.000Z"
  }
}
```

**Verdict Values:**

| Value        | Meaning                                        |
|--------------|-------------------------------------------------|
| `verified`   | Claim is confirmed by official government sources |
| `false`      | Claim is debunked by official government sources  |
| `unverified` | Insufficient evidence to confirm or deny          |

**Confidence Range:** `0.0` to `1.0` (float)

#### Response — Validation Error (400)

```json
{
  "success": false,
  "error": {
    "code": 400,
    "type": "VALIDATION_ERROR",
    "message": "claim must be at least 10 characters"
  }
}
```

#### Response — Rate Limited (429)

```json
{
  "success": false,
  "error": {
    "code": 429,
    "type": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 60
  }
}
```

**Headers:**

| Header        | Value |
|---------------|-------|
| Retry-After   | 60    |

#### Response — Server Error (500)

```json
{
  "success": false,
  "error": {
    "code": 500,
    "type": "INTERNAL_ERROR",
    "message": "An unexpected error occurred. Please try again."
  }
}
```

#### Response — Service Unavailable (503)

```json
{
  "success": false,
  "error": {
    "code": 503,
    "type": "SERVICE_UNAVAILABLE",
    "message": "Fact-checking service is temporarily unavailable. External APIs may be down.",
    "retryAfter": 120
  }
}
```

---

### 3.2 `GET /api/trending`

Retrieve the most recent fact-checked claims for the trending dashboard.

#### Request

**Query Parameters:**

| Parameter | Type    | Default | Description                            |
|-----------|---------|---------|----------------------------------------|
| `limit`   | integer | 20      | Number of items to return (max 50)     |
| `offset`  | integer | 0       | Pagination offset                      |

**Example:** `GET /api/trending?limit=10&offset=0`

#### Response — Success (200)

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "trend_001",
        "claim": "Free laptops being distributed under PM Yojana to all college students...",
        "verdict": "false",
        "confidence": 0.95,
        "createdAt": "2026-03-01T11:45:00.000Z",
        "verdictId": "abc123def456"
      },
      {
        "id": "trend_002",
        "claim": "Ayushman Bharat scheme covers up to ₹5 lakh per family per year...",
        "verdict": "verified",
        "confidence": 0.98,
        "createdAt": "2026-03-01T11:30:00.000Z",
        "verdictId": "xyz789ghi012"
      }
    ],
    "pagination": {
      "total": 156,
      "limit": 10,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

---

### 3.3 `GET /api/health`

Health check endpoint for monitoring and load balancer configuration.

#### Response — Healthy (200)

```json
{
  "status": "ok",
  "timestamp": "2026-03-01T12:00:00.000Z",
  "version": "1.0.0",
  "services": {
    "firestore": "connected",
    "gemini": "reachable",
    "tavily": "reachable"
  }
}
```

#### Response — Degraded (200)

```json
{
  "status": "degraded",
  "timestamp": "2026-03-01T12:00:00.000Z",
  "version": "1.0.0",
  "services": {
    "firestore": "connected",
    "gemini": "reachable",
    "tavily": "unreachable"
  }
}
```

#### Response — Unhealthy (503)

```json
{
  "status": "unhealthy",
  "timestamp": "2026-03-01T12:00:00.000Z",
  "version": "1.0.0",
  "services": {
    "firestore": "disconnected",
    "gemini": "unreachable",
    "tavily": "unreachable"
  }
}
```

---

### 3.4 `GET /api/stats`

Get daily aggregated statistics.

#### Request

**Query Parameters:**

| Parameter | Type   | Default | Description              |
|-----------|--------|---------|--------------------------|
| `date`    | string | today   | Date in `YYYY-MM-DD` format |

**Example:** `GET /api/stats?date=2026-03-01`

#### Response — Success (200)

```json
{
  "success": true,
  "data": {
    "date": "2026-03-01",
    "totalQueries": 142,
    "verdicts": {
      "verified": 38,
      "false": 87,
      "unverified": 17
    },
    "avgConfidence": 0.86,
    "avgProcessingTimeMs": 5840,
    "topClaims": [
      {
        "claim": "Free laptops being distributed under PM Yojana...",
        "count": 23
      },
      {
        "claim": "Government giving ₹5000 to all students...",
        "count": 15
      }
    ]
  }
}
```

---

## 4. Standard Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "error": {
    "code": 400,
    "type": "ERROR_TYPE",
    "message": "Human-readable error message",
    "retryAfter": null
  }
}
```

**Error Types:**

| Type                  | HTTP Code | Description                        |
|-----------------------|-----------|------------------------------------|
| `VALIDATION_ERROR`    | 400       | Invalid request body or parameters |
| `RATE_LIMIT_EXCEEDED` | 429       | Client exceeded rate limit         |
| `INTERNAL_ERROR`      | 500       | Unexpected server error            |
| `SERVICE_UNAVAILABLE` | 503       | External API dependencies are down |

---

## 5. Rate Limiting

| Scope      | Limit              | Window   | Header                     |
|------------|---------------------|----------|-----------------------------|
| Per IP     | 20 requests         | 1 minute | `X-RateLimit-Limit: 20`    |
| Global     | 500 requests        | 1 minute | N/A                         |

**Rate Limit Headers (on every response):**

| Header                 | Description                           |
|------------------------|---------------------------------------|
| `X-RateLimit-Limit`    | Maximum requests allowed per window   |
| `X-RateLimit-Remaining`| Requests remaining in current window  |
| `X-RateLimit-Reset`    | Unix timestamp when window resets     |
| `Retry-After`          | Seconds to wait (only on 429)         |

---

## 6. CORS Configuration

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',          // Vite dev server
    'https://trustlens.vercel.app',   // Production frontend
    'https://trustlens.in'            // Custom domain
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  maxAge: 86400  // 24 hours preflight cache
};
```

---

## 7. Request/Response Examples

### Example 1: Successful Fact-Check (False Claim)

```bash
curl -X POST http://localhost:3001/api/fact-check \
  -H "Content-Type: application/json" \
  -d '{"claim": "Government distributing free laptops to all college students under PM Digital India scheme"}'
```

```json
{
  "success": true,
  "data": {
    "id": "fw23kd93md",
    "claim": "Government distributing free laptops to all college students under PM Digital India scheme",
    "verdict": "false",
    "confidence": 0.94,
    "explanation": "There is no central government scheme for distributing free laptops to all college students. The PIB has debunked this claim as fake.",
    "sources": [
      {
        "title": "PIB Fact Check #3291",
        "url": "https://pib.gov.in/factcheck/3291",
        "domain": "pib.gov.in"
      }
    ],
    "cached": false,
    "processingTimeMs": 7120,
    "timestamp": "2026-03-01T12:05:30.000Z"
  }
}
```

### Example 2: Verified Claim

```bash
curl -X POST http://localhost:3001/api/fact-check \
  -H "Content-Type: application/json" \
  -d '{"claim": "Ayushman Bharat provides health coverage up to 5 lakh rupees per family"}'
```

```json
{
  "success": true,
  "data": {
    "id": "ak49dm21nf",
    "claim": "Ayushman Bharat provides health coverage up to 5 lakh rupees per family",
    "verdict": "verified",
    "confidence": 0.97,
    "explanation": "This is correct. The Ayushman Bharat PM-JAY scheme provides health coverage of up to ₹5 lakh per family per year, as stated on the official PMJAY website.",
    "sources": [
      {
        "title": "PMJAY Official Website — About the Scheme",
        "url": "https://pmjay.gov.in/about-pmjay",
        "domain": "pmjay.gov.in"
      }
    ],
    "cached": false,
    "processingTimeMs": 5430,
    "timestamp": "2026-03-01T12:06:15.000Z"
  }
}
```

### Example 3: Validation Error

```bash
curl -X POST http://localhost:3001/api/fact-check \
  -H "Content-Type: application/json" \
  -d '{"claim": "hello"}'
```

```json
{
  "success": false,
  "error": {
    "code": 400,
    "type": "VALIDATION_ERROR",
    "message": "claim must be at least 10 characters"
  }
}
```

---

## 8. Versioning Strategy

| Phase         | Strategy           | Details                              |
|---------------|--------------------|--------------------------------------|
| MVP (v1)      | No versioning      | Single `/api/` prefix               |
| Growth (v2)   | URL versioning     | `/api/v1/`, `/api/v2/`              |
| Deprecation   | 6-month window     | Old versions return sunset headers   |

---

*Document Version: 1.0 — March 2026*
