# Trust_Lens — Testing Strategy

## 1. Overview

This document defines the comprehensive testing strategy for Trust_Lens. Given the critical nature of fact-checking — where a wrong verdict can mislead citizens — testing is not optional; it's a core part of the product.

---

## 2. Testing Pyramid

```
                    ┌──────────┐
                    │   E2E    │  ◄── Manual (MVP) → Cypress (Growth)
                    │  (Few)   │
                   ┌┴──────────┴┐
                   │ Integration │  ◄── Supertest (API endpoint tests)
                   │  (Some)     │
                  ┌┴─────────────┴┐
                  │   Unit Tests   │  ◄── Jest/Vitest (functions, components)
                  │   (Many)       │
                  └────────────────┘

  Additional:
  ┌────────────────────────────────┐
  │  Prompt Accuracy Testing       │  ◄── Curated dataset of 20+ claims
  │  (AI-Specific)                 │
  └────────────────────────────────┘
```

---

## 3. Testing Scope by Layer

| Layer              | Framework        | Coverage Target | Priority |
|--------------------|------------------|-----------------|----------|
| Backend Unit       | Jest             | ≥ 80%           | P0       |
| Backend Integration| Supertest + Jest | All endpoints   | P0       |
| Frontend Unit      | Vitest           | ≥ 70%           | P1       |
| Frontend Component | Vitest + Testing Library | Key components | P1 |
| Prompt Accuracy    | Custom script    | ≥ 85% accuracy  | P0       |
| E2E (Manual)       | Manual checklist | Critical paths  | P0       |
| E2E (Automated)    | Cypress          | Post-MVP        | P2       |
| Performance        | Lighthouse + Custom | Post-MVP      | P2       |

---

## 4. Backend Unit Tests

### 4.1 What to Test

| Module                   | Test Cases                                         |
|--------------------------|----------------------------------------------------|
| `claimNormalizer.js`     | Lowercase, trim, remove punctuation, sort words    |
| `hashGenerator.js`       | Consistent SHA-256 output, empty string handling   |
| `formatVerdict.js`       | Valid JSON structure, field validation              |
| `responseParser.js`      | Parse valid JSON, handle malformed LLM output      |
| `inputSanitizer.js`      | Strip HTML, handle special characters, length limit|
| `sourceScorer.js`        | Correct authority scores for each .gov.in tier     |
| `relevanceScorer.js`     | Keyword overlap calculation accuracy               |
| `confidenceCalculator.js`| Weighted average, calibration rules, clamping      |

### 4.2 Example Tests

```javascript
// tests/unit/claimNormalizer.test.js
const { normalizeClaim } = require('../../src/utils/claimNormalizer');

describe('claimNormalizer', () => {
  test('converts to lowercase', () => {
    expect(normalizeClaim('FREE LAPTOPS For Students'))
      .toBe('for free laptops students');
  });

  test('trims whitespace', () => {
    expect(normalizeClaim('  hello world  '))
      .toBe('hello world');
  });

  test('removes punctuation', () => {
    expect(normalizeClaim('Is this true?!'))
      .toBe('is this true');
  });

  test('handles empty string', () => {
    expect(normalizeClaim('')).toBe('');
  });

  test('handles special characters', () => {
    expect(normalizeClaim('₹5000 for <script>alert("xss")</script>'))
      .toBe('5000 for');
  });
});
```

```javascript
// tests/unit/scoringEngine.test.js
const { calculateSourceAuthorityScore } = require('../../src/scoring/sourceScorer');

describe('sourceScorer', () => {
  test('PIB fact-check gets highest authority score', () => {
    const sources = [{ domain: 'pib.gov.in', url: 'https://pib.gov.in/factcheck/123' }];
    expect(calculateSourceAuthorityScore(sources)).toBeCloseTo(1.0, 1);
  });

  test('generic .gov.in gets lower score', () => {
    const sources = [{ domain: 'somestate.gov.in' }];
    expect(calculateSourceAuthorityScore(sources)).toBeLessThan(0.85);
  });

  test('no sources returns 0', () => {
    expect(calculateSourceAuthorityScore([])).toBe(0);
  });

  test('multiple high-authority sources boost score', () => {
    const sources = [
      { domain: 'pib.gov.in' },
      { domain: 'eci.gov.in' },
      { domain: 'mygov.in' }
    ];
    expect(calculateSourceAuthorityScore(sources)).toBeGreaterThan(0.85);
  });
});
```

---

## 5. Backend Integration Tests

### 5.1 API Endpoint Tests

```javascript
// tests/integration/factcheck.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/fact-check', () => {
  test('returns verdict for valid claim', async () => {
    const res = await request(app)
      .post('/api/fact-check')
      .send({ claim: 'Ayushman Bharat provides 5 lakh health coverage' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('verdict');
    expect(res.body.data).toHaveProperty('confidence');
    expect(res.body.data).toHaveProperty('explanation');
    expect(res.body.data).toHaveProperty('sources');
    expect(['verified', 'false', 'unverified']).toContain(res.body.data.verdict);
    expect(res.body.data.confidence).toBeGreaterThanOrEqual(0);
    expect(res.body.data.confidence).toBeLessThanOrEqual(1);
  }, 20000); // 20s timeout for API calls

  test('rejects empty claim', async () => {
    const res = await request(app)
      .post('/api/fact-check')
      .send({ claim: '' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.type).toBe('VALIDATION_ERROR');
  });

  test('rejects claim exceeding 500 characters', async () => {
    const res = await request(app)
      .post('/api/fact-check')
      .send({ claim: 'a'.repeat(501) });

    expect(res.status).toBe(400);
  });

  test('rejects missing claim field', async () => {
    const res = await request(app)
      .post('/api/fact-check')
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('GET /api/trending', () => {
  test('returns array of trending items', async () => {
    const res = await request(app).get('/api/trending');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });

  test('respects limit parameter', async () => {
    const res = await request(app).get('/api/trending?limit=5');

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeLessThanOrEqual(5);
  });
});

describe('GET /api/health', () => {
  test('returns healthy status', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('services');
  });
});
```

---

## 6. Frontend Tests

### 6.1 Component Tests

```javascript
// src/components/claim/ClaimInput.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ClaimInput from './ClaimInput';

describe('ClaimInput', () => {
  test('renders input field and submit button', () => {
    render(<ClaimInput onSubmit={() => {}} />);

    expect(screen.getByPlaceholderText(/paste a claim/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /check/i })).toBeInTheDocument();
  });

  test('disables button when input is empty', () => {
    render(<ClaimInput onSubmit={() => {}} />);

    const button = screen.getByRole('button', { name: /check/i });
    expect(button).toBeDisabled();
  });

  test('enables button when input has text', () => {
    render(<ClaimInput onSubmit={() => {}} />);

    const input = screen.getByPlaceholderText(/paste a claim/i);
    fireEvent.change(input, { target: { value: 'Test claim here' } });

    const button = screen.getByRole('button', { name: /check/i });
    expect(button).toBeEnabled();
  });

  test('calls onSubmit with claim text', () => {
    const mockSubmit = jest.fn();
    render(<ClaimInput onSubmit={mockSubmit} />);

    const input = screen.getByPlaceholderText(/paste a claim/i);
    fireEvent.change(input, { target: { value: 'Is this scheme real?' } });
    fireEvent.click(screen.getByRole('button', { name: /check/i }));

    expect(mockSubmit).toHaveBeenCalledWith('Is this scheme real?');
  });

  test('shows character count', () => {
    render(<ClaimInput onSubmit={() => {}} />);

    const input = screen.getByPlaceholderText(/paste a claim/i);
    fireEvent.change(input, { target: { value: 'hello' } });

    expect(screen.getByText(/495/i)).toBeInTheDocument(); // 500 - 5
  });
});
```

```javascript
// src/components/verdict/VerdictCard.test.jsx
import { render, screen } from '@testing-library/react';
import VerdictCard from './VerdictCard';

describe('VerdictCard', () => {
  const mockVerdict = {
    verdict: 'false',
    confidence: 0.92,
    explanation: 'This claim is debunked by PIB.',
    sources: [{ title: 'PIB Fact Check', url: 'https://pib.gov.in/factcheck/123' }]
  };

  test('displays verdict label', () => {
    render(<VerdictCard data={mockVerdict} />);
    expect(screen.getByText(/false/i)).toBeInTheDocument();
  });

  test('displays explanation', () => {
    render(<VerdictCard data={mockVerdict} />);
    expect(screen.getByText(/debunked/i)).toBeInTheDocument();
  });

  test('displays source links', () => {
    render(<VerdictCard data={mockVerdict} />);
    const link = screen.getByText('PIB Fact Check');
    expect(link).toHaveAttribute('href', 'https://pib.gov.in/factcheck/123');
  });

  test('displays confidence percentage', () => {
    render(<VerdictCard data={mockVerdict} />);
    expect(screen.getByText(/92%/i)).toBeInTheDocument();
  });
});
```

---

## 7. Prompt Accuracy Testing

### 7.1 Test Dataset

A curated set of 20 claims with known ground truths, used to measure LLM verdict accuracy.

| #  | Claim                                                    | Expected Verdict | Category    |
|----|----------------------------------------------------------|------------------|-------------|
| 1  | Free laptops being distributed under PM Yojana           | `false`          | Scheme      |
| 2  | Ayushman Bharat covers ₹5 lakh per family per year       | `verified`       | Scheme      |
| 3  | Government giving ₹5000 to all WhatsApp users            | `false`          | Scam        |
| 4  | PM Kisan scheme gives ₹6000 per year to farmers          | `verified`       | Scheme      |
| 5  | EVMs can be hacked using Bluetooth                       | `false`          | Election    |
| 6  | Voter ID is mandatory for voting in India                 | `verified`       | Election    |
| 7  | Free sewing machines given to all women under PMKVY      | `false`          | Scheme      |
| 8  | Aadhaar is mandatory for all government schemes           | `false`          | Policy      |
| 9  | Ujjwala Yojana provides free LPG connections              | `verified`       | Scheme      |
| 10 | Government charging ₹50 tax for WhatsApp messages         | `false`          | Scam        |
| 11 | MGNREGA guarantees 100 days of employment                 | `verified`       | Scheme      |
| 12 | Government cancelling all ₹500 notes again                | `false`          | Financial   |
| 13 | Sukanya Samriddhi Yojana is for girl child savings        | `verified`       | Scheme      |
| 14 | India introducing 4-day work week for all                  | `false`          | Policy      |
| 15 | ECI can postpone elections due to natural disasters       | `verified`       | Election    |
| 16 | Free ₹1.5 lakh given to SC/ST students for education     | `unverified`     | Scheme      |
| 17 | PM Mudra Loan provides up to ₹10 lakh                     | `verified`       | Scheme      |
| 18 | Government banning cryptocurrency completely               | `false`          | Financial   |
| 19 | Digital India programme provides free internet to villages | `false`          | Scheme      |
| 20 | One Nation One Ration Card allows buying from any FPS      | `verified`       | Scheme      |

### 7.2 Accuracy Measurement

```javascript
// scripts/test-claims.js
const testClaims = require('./test-dataset.json');
const { factCheck } = require('../src/chains/ragChain');

async function runAccuracyTest() {
  let correct = 0;
  let total = testClaims.length;
  const results = [];

  for (const test of testClaims) {
    const result = await factCheck(test.claim);
    const isCorrect = result.verdict === test.expectedVerdict;
    
    if (isCorrect) correct++;

    results.push({
      claim: test.claim,
      expected: test.expectedVerdict,
      actual: result.verdict,
      confidence: result.confidence,
      correct: isCorrect
    });

    console.log(`${isCorrect ? '✅' : '❌'} ${test.claim}`);
    console.log(`   Expected: ${test.expectedVerdict}, Got: ${result.verdict}`);
  }

  const accuracy = (correct / total * 100).toFixed(1);
  console.log(`\n📊 Accuracy: ${accuracy}% (${correct}/${total})`);
  
  return { accuracy, results };
}
```

### 7.3 Accuracy Targets

| Phase   | Target   | Action if Below Target                      |
|---------|----------|---------------------------------------------|
| MVP     | ≥ 85%    | Revise prompt template, adjust search queries|
| Growth  | ≥ 90%    | Add more prompt examples, fine-tune scoring  |
| Scale   | ≥ 95%    | Add human review for edge cases              |

---

## 8. Manual E2E Test Checklist

### 8.1 Happy Path

| # | Step                                              | Expected Result                      | Pass? |
|---|---------------------------------------------------|--------------------------------------|-------|
| 1 | Open the application in Chrome                    | Home page loads, input visible       | ⬜    |
| 2 | Paste: "Free laptops under PM Yojana"             | Text appears in input field          | ⬜    |
| 3 | Click "Check This Claim"                          | Loading spinner appears              | ⬜    |
| 4 | Wait for result (< 15 seconds)                    | Verdict card appears                 | ⬜    |
| 5 | Check verdict is "False" (🚩)                     | Red traffic light shown              | ⬜    |
| 6 | Check explanation is in plain language             | 2 sentences, understandable          | ⬜    |
| 7 | Check confidence bar is visible                   | Shows percentage                     | ⬜    |
| 8 | Click source link                                 | Opens .gov.in page in new tab        | ⬜    |
| 9 | Scroll to trending section                        | Recent claims visible                | ⬜    |
| 10| Submit another claim                              | New verdict replaces old one         | ⬜    |

### 8.2 Error Paths

| # | Step                                              | Expected Result                      | Pass? |
|---|---------------------------------------------------|--------------------------------------|-------|
| 1 | Submit with empty input                           | Button is disabled                   | ⬜    |
| 2 | Submit with only spaces                           | Button stays disabled or error shown | ⬜    |
| 3 | Submit 501-character text                          | Error: exceeds limit                 | ⬜    |
| 4 | Disconnect internet → submit                     | "No internet" error shows            | ⬜    |
| 5 | Submit 25 times rapidly                           | Rate limit message after 20          | ⬜    |

### 8.3 Responsive Testing

| # | Device/Width        | Check                            | Pass? |
|---|---------------------|----------------------------------|-------|
| 1 | Mobile (360px)      | No horizontal scroll, readable   | ⬜    |
| 2 | Tablet (768px)      | Layout adjusts, cards readable   | ⬜    |
| 3 | Desktop (1440px)    | Full layout, no oversized gaps   | ⬜    |

---

## 9. Test Execution Commands

```bash
# Run all tests
npm run test

# Run backend tests only
npm -w backend run test

# Run frontend tests only
npm -w frontend run test

# Run tests in watch mode (development)
npm -w backend run test -- --watch

# Run with coverage report
npm -w backend run test -- --coverage

# Run prompt accuracy test
node scripts/test-claims.js
```

---

## 10. Test Configuration

### 10.1 Backend (Jest)

```json
// backend/package.json
{
  "scripts": {
    "test": "jest --verbose --forceExit",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "coverageDirectory": "coverage",
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

### 10.2 Frontend (Vitest)

```javascript
// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        branches: 60,
        functions: 70,
        lines: 70
      }
    }
  }
});
```

---

*Document Version: 1.0 — March 2026*
