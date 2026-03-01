# Trust_Lens — User Stories & Acceptance Criteria

## 1. Epic: Claim Fact-Checking

### US-101: Submit a Claim for Verification

**As a** citizen who received a suspicious WhatsApp forward,
**I want to** paste the claim text and submit it for fact-checking,
**So that** I can quickly know if the information is true or false.

**Acceptance Criteria:**

| #  | Criteria                                                                   | Status |
|----|----------------------------------------------------------------------------|--------|
| 1  | A text input field is visible on the home page                             | ⬜     |
| 2  | Input field accepts up to 500 characters                                   | ⬜     |
| 3  | A character counter shows remaining characters                             | ⬜     |
| 4  | A "Check This Claim" button is visible and enabled when input is non-empty | ⬜     |
| 5  | The button is disabled when the input is empty or whitespace-only          | ⬜     |
| 6  | Clicking the button triggers a loading state (spinner/skeleton)            | ⬜     |
| 7  | The input field is cleared after a successful submission                   | ⬜     |
| 8  | The system trims leading/trailing whitespace before processing             | ⬜     |

---

### US-102: View a Fact-Check Verdict

**As a** user who just submitted a claim,
**I want to** see a clear, visual verdict (true/false/unverified),
**So that** I immediately understand whether the claim is trustworthy.

**Acceptance Criteria:**

| #  | Criteria                                                                   | Status |
|----|----------------------------------------------------------------------------|--------|
| 1  | A verdict card appears after processing completes                          | ⬜     |
| 2  | The card shows a Traffic Light icon: ✅ (Verified), 🚩 (False), ⚠️ (Unverified) | ⬜ |
| 3  | The card shows a 2-sentence plain-language explanation                     | ⬜     |
| 4  | The card shows a confidence score as a percentage bar (0–100%)             | ⬜     |
| 5  | The card shows the original claim text for reference                       | ⬜     |
| 6  | The verdict card has appropriate color-coding (green/red/yellow)           | ⬜     |
| 7  | The card is responsive and readable on mobile screens (320px+)             | ⬜     |

---

### US-103: View Source Citations

**As a** user who received a verdict,
**I want to** see the official government sources used for the verdict,
**So that** I can independently verify the information and trust the result.

**Acceptance Criteria:**

| #  | Criteria                                                                   | Status |
|----|----------------------------------------------------------------------------|--------|
| 1  | Each verdict card includes a "Sources" section                             | ⬜     |
| 2  | Sources display as clickable links with descriptive titles                 | ⬜     |
| 3  | Clicking a source link opens the `.gov.in` page in a new tab              | ⬜     |
| 4  | At least 1 source is shown for every verdict (except "unverified")        | ⬜     |
| 5  | Source URLs are from `.gov.in` domains only                                | ⬜     |

---

### US-104: Handle Processing Errors Gracefully

**As a** user,
**I want to** see a clear error message if something goes wrong,
**So that** I know the issue and can try again.

**Acceptance Criteria:**

| #  | Criteria                                                                   | Status |
|----|----------------------------------------------------------------------------|--------|
| 1  | If the backend returns a 429 error, display "Too many requests. Please wait a moment." | ⬜ |
| 2  | If the backend returns a 500 error, display "Something went wrong. Please try again." | ⬜ |
| 3  | If the network is offline, display "No internet connection."               | ⬜     |
| 4  | Error messages are dismissible                                             | ⬜     |
| 5  | The input field remains populated so the user can retry                    | ⬜     |
| 6  | A "Try Again" button is shown alongside the error message                 | ⬜     |

---

## 2. Epic: Trending Misinformation Dashboard

### US-201: View Trending Claims

**As a** citizen curious about what misinformation is circulating,
**I want to** see a live feed of recently fact-checked claims,
**So that** I can proactively learn which viral claims are false.

**Acceptance Criteria:**

| #  | Criteria                                                                   | Status |
|----|----------------------------------------------------------------------------|--------|
| 1  | A "Trending" section is visible on the home page below the verdict area   | ⬜     |
| 2  | The section displays the 20 most recent fact-checked claims               | ⬜     |
| 3  | Each entry shows: claim text (truncated), verdict icon, timestamp          | ⬜     |
| 4  | The list updates in real-time without page refresh                        | ⬜     |
| 5  | Clicking a trending item shows its full verdict card                      | ⬜     |

---

### US-202: Real-Time Updates

**As a** user viewing the trending dashboard,
**I want to** see new entries appear automatically as other users submit claims,
**So that** the dashboard always reflects the latest activity.

**Acceptance Criteria:**

| #  | Criteria                                                                   | Status |
|----|----------------------------------------------------------------------------|--------|
| 1  | New verdicts from other users appear within 5 seconds of being saved      | ⬜     |
| 2  | New entries animate in smoothly (fade/slide)                               | ⬜     |
| 3  | The list maintains chronological order (newest first)                      | ⬜     |
| 4  | No page refresh is required                                                | ⬜     |

---

## 3. Epic: AI Fact-Check Engine (Backend)

### US-301: RAG Pipeline Execution

**As a** system (backend),
**I want to** execute a complete RAG pipeline for each claim,
**So that** every verdict is grounded in live, verified government documents.

**Acceptance Criteria:**

| #  | Criteria                                                                   | Status |
|----|----------------------------------------------------------------------------|--------|
| 1  | System generates 2–3 targeted search queries from the user's claim        | ⬜     |
| 2  | System executes parallel searches via Tavily and Google CSE               | ⬜     |
| 3  | Search results are filtered to `.gov.in` domains only                     | ⬜     |
| 4  | Top 5 most relevant documents are selected after deduplication            | ⬜     |
| 5  | A structured prompt is built with claim + retrieved evidence              | ⬜     |
| 6  | Gemini API is called with temperature ≤ 0.2 and JSON mode enabled        | ⬜     |
| 7  | LLM response is parsed and validated as JSON                              | ⬜     |
| 8  | If LLM response is malformed, verdict defaults to "unverified"            | ⬜     |
| 9  | Total pipeline execution completes within 10 seconds                      | ⬜     |

---

### US-302: Source Fallback Handling

**As a** system (backend),
**I want to** automatically fall back to alternative search providers,
**So that** the service remains operational even if one API is down.

**Acceptance Criteria:**

| #  | Criteria                                                                   | Status |
|----|----------------------------------------------------------------------------|--------|
| 1  | If Tavily API fails, system falls back to Google CSE automatically        | ⬜     |
| 2  | If Google CSE also fails, system returns "unverified" with explanation    | ⬜     |
| 3  | Fallback happens transparently — user is unaware of the switch            | ⬜     |
| 4  | Fallback events are logged for monitoring                                 | ⬜     |

---

### US-303: Verdict Caching

**As a** system (backend),
**I want to** cache verdicts for previously checked claims,
**So that** repeated claims are answered instantly without redundant API calls.

**Acceptance Criteria:**

| #  | Criteria                                                                   | Status |
|----|----------------------------------------------------------------------------|--------|
| 1  | Claims are normalized (lowercase, trimmed, sorted) before hashing         | ⬜     |
| 2  | Cache key is a SHA-256 hash of the normalized claim                       | ⬜     |
| 3  | Cached verdicts expire after 1 hour (TTL)                                 | ⬜     |
| 4  | Cache hits return in < 500ms                                              | ⬜     |
| 5  | Cache stores up to 1,000 entries (MVP)                                    | ⬜     |

---

### US-304: Verdict Persistence

**As a** system (backend),
**I want to** save every query and its verdict to Firestore,
**So that** the trending dashboard has data and we can analyze patterns.

**Acceptance Criteria:**

| #  | Criteria                                                                   | Status |
|----|----------------------------------------------------------------------------|--------|
| 1  | Every verdict is saved to Firestore `verdicts` collection                 | ⬜     |
| 2  | Saved data includes: claim, verdict, confidence, explanation, sources, timestamp | ⬜ |
| 3  | Firestore write is asynchronous (does not block the user response)        | ⬜     |
| 4  | If Firestore write fails, the user still receives their verdict           | ⬜     |

---

## 4. Epic: UI/UX & Responsiveness

### US-401: Mobile-First Responsive Design

**As a** mobile user (primary target audience),
**I want to** use Trust_Lens on my smartphone without any layout issues,
**So that** I can fact-check claims directly from my WhatsApp screen.

**Acceptance Criteria:**

| #  | Criteria                                                                   | Status |
|----|----------------------------------------------------------------------------|--------|
| 1  | Layout works correctly from 320px to 1920px width                         | ⬜     |
| 2  | No horizontal scrolling on any screen size                                | ⬜     |
| 3  | Text is readable without zooming on mobile                                | ⬜     |
| 4  | Buttons and interactive elements are at least 44px × 44px (touch-friendly)| ⬜     |
| 5  | The input field and submit button are immediately visible (above the fold) | ⬜     |

---

### US-402: Accessibility Compliance

**As a** user with visual impairments,
**I want to** navigate and use Trust_Lens with assistive technologies,
**So that** the platform is inclusive and usable for everyone.

**Acceptance Criteria:**

| #  | Criteria                                                                   | Status |
|----|----------------------------------------------------------------------------|--------|
| 1  | All interactive elements are keyboard-navigable (Tab, Enter, Escape)      | ⬜     |
| 2  | All images/icons have appropriate `alt` text or `aria-label`              | ⬜     |
| 3  | Color contrast meets WCAG 2.1 AA (4.5:1 ratio)                           | ⬜     |
| 4  | Verdict status is communicated via text, not only color                   | ⬜     |
| 5  | Form inputs have associated `<label>` elements                            | ⬜     |

---

### US-403: Loading & Skeleton States

**As a** user waiting for a verdict,
**I want to** see a clear, animated loading indicator,
**So that** I know the system is processing my claim and hasn't frozen.

**Acceptance Criteria:**

| #  | Criteria                                                                   | Status |
|----|----------------------------------------------------------------------------|--------|
| 1  | A loading spinner or skeleton card appears within 200ms of submission     | ⬜     |
| 2  | The loading state clearly indicates "Checking with government sources..." | ⬜     |
| 3  | The submit button is disabled during loading to prevent double submission | ⬜     |
| 4  | If loading exceeds 15 seconds, a timeout message is displayed             | ⬜     |

---

## 5. Epic: Security & Rate Limiting

### US-501: Input Sanitization

**As a** system,
**I want to** sanitize all user inputs before processing,
**So that** the platform is protected against XSS and injection attacks.

**Acceptance Criteria:**

| #  | Criteria                                                                   | Status |
|----|----------------------------------------------------------------------------|--------|
| 1  | HTML tags are stripped from claim input                                    | ⬜     |
| 2  | Script injection attempts are neutralized                                 | ⬜     |
| 3  | Input length is enforced server-side (max 500 chars)                      | ⬜     |

---

### US-502: Rate Limiting

**As a** system,
**I want to** enforce rate limits on API endpoints,
**So that** the service is protected against abuse and API cost overruns.

**Acceptance Criteria:**

| #  | Criteria                                                                   | Status |
|----|----------------------------------------------------------------------------|--------|
| 1  | Maximum 20 requests per minute per IP address                             | ⬜     |
| 2  | Exceeding the limit returns a 429 status code                             | ⬜     |
| 3  | The response includes a `Retry-After` header                              | ⬜     |
| 4  | The frontend displays a user-friendly rate limit message                  | ⬜     |

---

## 6. Story Map Summary

```
 EPIC                  │ STORIES        │ PRIORITY │ SPRINT
────────────────────────┼────────────────┼──────────┼────────
 Claim Fact-Checking    │ US-101 ~ 104   │ P0       │ 1
 Trending Dashboard     │ US-201 ~ 202   │ P1       │ 1–2
 AI Engine (Backend)    │ US-301 ~ 304   │ P0       │ 1
 UI/UX & Responsive     │ US-401 ~ 403   │ P0–P1    │ 1–2
 Security & Limits      │ US-501 ~ 502   │ P0       │ 1
```

---

*Document Version: 1.0 — March 2026*
