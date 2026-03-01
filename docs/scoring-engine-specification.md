# Trust_Lens — Scoring Engine Specification

## 1. Overview

The Scoring Engine is the trust-quantification module of Trust_Lens. It converts raw search results and LLM analysis into a **numerical confidence score** (0.0 – 1.0) that tells the user how confident the system is about its verdict.

The engine works alongside the RAG pipeline — after the LLM generates a verdict and explanation, the Scoring Engine independently validates and calibrates the confidence level.

---

## 2. Scoring Pipeline

```
┌──────────────────────────────────────────────────────────────┐
│                    SCORING ENGINE PIPELINE                     │
│                                                              │
│  Input:                                                      │
│  ├── User Claim (string)                                     │
│  ├── Retrieved Documents (array)                             │
│  ├── LLM Verdict + Explanation                               │
│  └── Source URLs (array)                                     │
│                                                              │
│  ┌──────────────┐  ┌───────────────┐  ┌────────────────┐    │
│  │  Source       │  │  Relevance    │  │  Consensus     │    │
│  │  Authority    │  │  Alignment    │  │  Agreement     │    │
│  │  Scorer       │  │  Scorer       │  │  Scorer        │    │
│  │  (0.0 – 1.0) │  │  (0.0 – 1.0) │  │  (0.0 – 1.0)  │    │
│  └──────┬───────┘  └──────┬────────┘  └───────┬────────┘    │
│         │                 │                    │              │
│         └────────┬────────┘────────────────────┘              │
│                  │                                            │
│         ┌────────▼────────┐                                   │
│         │  Confidence     │                                   │
│         │  Aggregator     │                                   │
│         │  (Weighted Avg) │                                   │
│         └────────┬────────┘                                   │
│                  │                                            │
│         ┌────────▼────────┐                                   │
│         │  Calibration    │                                   │
│         │  & Clamping     │                                   │
│         │  (0.0 – 1.0)   │                                   │
│         └────────┬────────┘                                   │
│                  │                                            │
│  Output:         │                                            │
│  └── Final Confidence Score (float, 0.0 – 1.0)              │
└──────────────────┴───────────────────────────────────────────┘
```

---

## 3. Scoring Components

### 3.1 Source Authority Scorer

Assigns a trust score based on the authority and credibility of the retrieved sources.

**Source Authority Tiers:**

| Tier | Domain Pattern           | Authority Score | Description                     |
|------|--------------------------|----------------|---------------------------------|
| S    | `pib.gov.in/factcheck`   | 1.00           | Official PIB fact-check articles |
| A    | `pib.gov.in`             | 0.95           | Press Information Bureau         |
| A    | `eci.gov.in`             | 0.95           | Election Commission of India     |
| A    | `pmjay.gov.in`           | 0.90           | PM scheme-specific portals       |
| B    | `mygov.in`               | 0.85           | MyGov citizen portal             |
| B    | `india.gov.in`           | 0.85           | National Portal of India         |
| C    | `*.gov.in`               | 0.75           | Other government sites           |
| D    | Other `.gov` domains     | 0.50           | Non-Indian government            |
| F    | Non-government           | 0.00           | Rejected (should not appear)     |

**Calculation:**

```javascript
function calculateSourceAuthorityScore(sources) {
  if (sources.length === 0) return 0.0;

  const scores = sources.map(source => getAuthorityScore(source.domain));
  const maxScore = Math.max(...scores);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  // Weighted: 60% best source, 40% average of all sources
  return (maxScore * 0.6) + (avgScore * 0.4);
}
```

---

### 3.2 Relevance Alignment Scorer

Measures how closely the retrieved documents match the user's original claim.

**Scoring Factors:**

| Factor                    | Weight | Measurement                                |
|---------------------------|--------|--------------------------------------------|
| Keyword Overlap           | 0.40   | % of claim keywords found in documents    |
| Semantic Similarity       | 0.30   | Cosine similarity of key phrases           |
| Topic Match               | 0.20   | Same category (scheme/election/policy)     |
| Recency                   | 0.10   | Document age penalty (older = lower score) |

**Keyword Overlap Calculation:**

```javascript
function calculateKeywordOverlap(claim, documents) {
  const claimKeywords = extractKeywords(claim);  // Remove stop words
  const docText = documents.map(d => d.content).join(' ').toLowerCase();

  const matchedKeywords = claimKeywords.filter(kw =>
    docText.includes(kw.toLowerCase())
  );

  return matchedKeywords.length / claimKeywords.length;
}
```

**Recency Penalty:**

| Document Age    | Recency Score |
|-----------------|---------------|
| < 7 days        | 1.00          |
| 7–30 days       | 0.90          |
| 1–6 months      | 0.75          |
| 6–12 months     | 0.60          |
| > 12 months     | 0.40          |

---

### 3.3 Consensus Agreement Scorer

Measures the level of agreement across multiple retrieved sources.

**Logic:**

```javascript
function calculateConsensusScore(documents, llmVerdict) {
  // Count how many documents support/contradict the verdict
  const supporting = documents.filter(d => alignsWithVerdict(d, llmVerdict));
  const contradicting = documents.filter(d => contradictsVerdict(d, llmVerdict));

  const supportRatio = supporting.length / documents.length;
  const contradictRatio = contradicting.length / documents.length;

  if (contradictRatio > 0.3) {
    // Significant contradiction → lower confidence
    return Math.max(0.3, supportRatio - contradictRatio);
  }

  return supportRatio;
}
```

**Consensus Levels:**

| Support Ratio  | Consensus Level | Score Modifier |
|----------------|-----------------|----------------|
| > 80%          | Strong           | 1.0            |
| 60–80%         | Moderate         | 0.8            |
| 40–60%         | Weak             | 0.6            |
| < 40%          | Conflicting      | 0.3            |

---

## 4. Confidence Aggregation

### 4.1 Weighted Average Formula

```
Final Score = (W1 × Source Authority) + (W2 × Relevance) + (W3 × Consensus)
```

**Default Weights:**

| Component         | Weight (W) | Justification                                    |
|-------------------|------------|--------------------------------------------------|
| Source Authority   | 0.40       | Most important — trustworthy source = trustworthy verdict |
| Relevance          | 0.30       | High relevance = evidence directly addresses claim |
| Consensus          | 0.30       | Agreement across sources = higher reliability     |

**Total:** W1 + W2 + W3 = 1.0

---

### 4.2 Calibration Rules

After aggregation, the raw score is calibrated with the following rules:

```javascript
function calibrateScore(rawScore, verdict, numSources) {
  let calibrated = rawScore;

  // Rule 1: No sources → cap confidence at 0.3
  if (numSources === 0) {
    calibrated = Math.min(calibrated, 0.30);
  }

  // Rule 2: Only 1 source → cap at 0.7
  if (numSources === 1) {
    calibrated = Math.min(calibrated, 0.70);
  }

  // Rule 3: "Unverified" verdict → cap at 0.5
  if (verdict === 'unverified') {
    calibrated = Math.min(calibrated, 0.50);
  }

  // Rule 4: Floor at 0.1 (never show 0% confidence)
  calibrated = Math.max(calibrated, 0.10);

  // Rule 5: Ceiling at 0.99 (never show 100% — AI is not infallible)
  calibrated = Math.min(calibrated, 0.99);

  return Math.round(calibrated * 100) / 100;  // 2 decimal places
}
```

---

## 5. Confidence Display Mapping

### 5.1 User-Facing Labels

| Score Range | Label            | Color   | Icon | Description                        |
|-------------|------------------|---------|------|------------------------------------|
| 0.90 – 0.99| Very High        | Green   | ████████████ | Strong evidence from official sources |
| 0.70 – 0.89| High             | Green   | █████████░░░ | Good evidence, high reliability    |
| 0.50 – 0.69| Moderate         | Yellow  | ██████░░░░░░ | Some evidence, but not conclusive  |
| 0.30 – 0.49| Low              | Orange  | ████░░░░░░░░ | Limited evidence, interpret with caution |
| 0.10 – 0.29| Very Low         | Red     | ██░░░░░░░░░░ | Insufficient evidence              |

### 5.2 Display Format

```
Confidence: ████████░░ 82%
```

- Percentage = `Math.round(score * 100)`
- Bar segments = `Math.round(score * 10)` filled out of 10

---

## 6. Edge Cases & Handling

| Scenario                             | Score Behavior                          |
|--------------------------------------|----------------------------------------|
| No sources retrieved                 | Capped at 0.30, verdict = "unverified" |
| All sources from PIB Fact Check      | Boosted, source authority ≈ 1.0        |
| Sources contradict each other        | Consensus score ≈ 0.3, overall reduced |
| Claim about very recent event        | Recency score = 1.0, but may have fewer sources |
| LLM output is malformed              | Score = 0.10, verdict = "unverified"   |
| Search APIs both fail                | Score = 0.10, verdict = "unverified"   |
| Claim is not about government        | Score = 0.20, verdict = "unverified", explanation = "Not a government claim" |

---

## 7. Scoring Engine API (Internal)

```javascript
/**
 * Calculate the final confidence score for a fact-check verdict.
 *
 * @param {Object} params
 * @param {string} params.claim - Original user claim
 * @param {Array}  params.documents - Retrieved source documents
 * @param {string} params.verdict - LLM verdict ("verified"|"false"|"unverified")
 * @param {Array}  params.sources - Source URLs with domains
 * @returns {Object} { score: number, breakdown: Object }
 */
function calculateConfidence({ claim, documents, verdict, sources }) {
  const sourceScore    = calculateSourceAuthorityScore(sources);
  const relevanceScore = calculateRelevanceScore(claim, documents);
  const consensusScore = calculateConsensusScore(documents, verdict);

  const rawScore = (0.40 * sourceScore) +
                   (0.30 * relevanceScore) +
                   (0.30 * consensusScore);

  const finalScore = calibrateScore(rawScore, verdict, sources.length);

  return {
    score: finalScore,
    breakdown: {
      sourceAuthority: sourceScore,
      relevance: relevanceScore,
      consensus: consensusScore,
      raw: rawScore,
      calibrated: finalScore
    }
  };
}
```

---

## 8. Future Enhancements

| Feature                          | Description                                      |
|----------------------------------|--------------------------------------------------|
| ML-based relevance scoring       | Replace keyword overlap with embedding similarity |
| User feedback loop               | Allow users to flag inaccurate verdicts → retrain |
| Historical accuracy tracking     | Track scoring accuracy over time for calibration  |
| Confidence explanation           | Show users WHY confidence is high/low in plain text |
| Domain-specific weight tuning    | Different weights for election vs. scheme claims  |

---

*Document Version: 1.0 — March 2026*
