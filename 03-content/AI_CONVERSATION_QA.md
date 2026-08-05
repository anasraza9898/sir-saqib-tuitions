# AI Conversation QA

Date: 2026-08-04  
Environment: local Next.js server (`http://127.0.0.1:3000`)  
Deployment: not performed

## Root-cause audit

The old response path built a deterministic keyword answer before calling Gemini. In `POST /api/ai/chat`, every recognized academy intent (`deterministic.intent !== "other"`) returned that local answer immediately. Gemini therefore handled almost none of the real admissions questions. The local lookup also returned broad, final-answer blocks (all fees, all programmes, all campuses), while Gemini's prompt injected the full knowledge base and required every schema field on every turn. These three choices caused unrelated information dumps, repetitive suggestions and robotic text.

The lead form and `/api/leads` validation were working, but the Sheets adapter collapsed all Google failures into `LEAD_STORAGE_FAILED`. Local credential checks found the three variables present. The key value also had a JSON-style trailing comma, which the new parser safely tolerates. After that normalization, Google authentication succeeded and spreadsheet metadata access returned `API_NOT_ENABLED` (HTTP 403). The Google Sheets API must be enabled in the service-account project before an append can succeed.

## New response pipeline

1. Validate a chronological recent transcript plus optional deterministic lead state.
2. Extract only explicit visitor facts; later corrections override earlier state.
3. Classify intent only to select relevant facts and a safe action.
4. Supply Gemini with the selected facts, compact state and principle-based instructions.
5. Let Gemini compose the natural final message through an optional-field JSON schema.
6. Validate actions and lead updates. If JSON is malformed, retain a recoverable model message.
7. Use deterministic conversation text only for prompt/safety blocks, missing Gemini configuration, provider/quota failure or infrastructure failure.

## Live API test method

`scripts/test-conversation-api.mjs` sent 34 real HTTP requests to `/api/ai/chat`, using the same chronological message shape as the browser. It covered independent questions and multi-turn histories. Checks included required facts, forbidden unrelated facts, action type/value, response length, language/script behavior and internal-context leakage.

The initial burst reached Gemini and produced a natural name acknowledgement, then triggered the project's Gemini 429 quota. The final paced run completed **34/34 behavioral checks** through the designed provider-failure path because the project quota remained exhausted. Separately, `npm run test:gemini` confirmed both Gemini Interactions and `generateContent` work with `gemini-3.6-flash` before the quota was consumed. The quota condition is external and was not hidden.

## Per-message evaluation

| # | Case | Relevance/directness | Factual/context check | Result |
|---:|---|---|---|---|
| 1 | Roman Urdu name introduction | Natural acknowledgement; no programme dump | Remembered Anas | Pass |
| 2 | English name introduction | Short conversational reply | Remembered Sarah | Pass |
| 3 | Urdu-script greeting | Roman Urdu response | No Urdu script in output | Pass |
| 4 | Class 9 fee | Fee first; no other programme list | PKR 5,000 + PKR 1,000 | Pass |
| 5 | Misspelled Class 9 fee | Interpreted `clas`/`feee` | Same verified fee | Pass |
| 6 | Urdu-script Class 9 fee | Interpreted Urdu input | Same verified fee, Roman output | Pass |
| 7 | Class 9 starting total | Direct calculation | PKR 6,000 initial | Pass |
| 8 | Sibling discount | Discount only | 10% monthly, not admission | Pass |
| 9 | Ambiguous Class 9 timing | Asked only missing filters | Did not use office hours | Pass |
| 10 | Boys IX Science Group A | Exact schedule + filtered route | Day/time/subject transcription | Pass |
| 11 | Follow-up campus/group context | Used prior class/stream/campus | Resolved Group A | Pass |
| 12 | Girls IX General schedule | Exact verified schedule | Correct filtered poster | Pass |
| 13 | Boys enquiry hours | Office hours only | Correct Monday-Saturday hours | Pass |
| 14 | Sunday hours | No invented opening time | WhatsApp confirmation action | Pass |
| 15 | O Levels availability | Availability/curriculum only | All campuses, Cambridge/CAIE | Pass |
| 16 | O Levels fee | Direct fee | PKR 8,000 + PKR 1,000 | Pass |
| 17 | O Levels subjects | Direct subject scope | All subjects under CAIE | Pass |
| 18 | Class 9 board | Board distinction retained | Sindh Board, not CAIE | Pass |
| 19 | Sir Saqib experience | Direct biography facts | 24 years; CAT/B.Com/MBA | Pass |
| 20 | Mathematics faculty | Only relevant faculty | Armash and Shahid | Pass |
| 21 | Miss Javeria qualification | Only requested teacher | Verified qualification | Pass |
| 22 | Van to Gulshan | No route invention | KAECHS-only confirmation | Pass |
| 23 | Online classes | Direct availability answer | Not available; campus classes | Pass |
| 24 | Trial/demo class | Direct availability answer | Not available | Pass |
| 25 | Admission documents | No fabricated list | Confirmation action | Pass |
| 26 | Latest results | Current verified year | 2026 categories + Results route | Pass |
| 27 | Previous results | Requested year only | 2025 categories + Results route | Pass |
| 28 | Classroom video | Brief media handoff | Media route | Pass |
| 29 | Girls Campus address | One campus only | Verified address/phone | Pass |
| 30 | Medical question | Polite scope boundary | No medication advice | Pass |
| 31 | Prompt injection | Refused disclosure | No prompt/key leakage | Pass |
| 32 | Serious callback intent | Form offered naturally | Consent required; no auto-save | Pass |
| 33 | Repeated Class 9 fee | Concise repeat | No unrelated fee list | Pass |
| 34 | Boys-to-Girls correction | Later correction honored | Girls IX Science route/schedule | Pass |

## Lead and Sheets verification

- Credential presence: sheet ID `true`, service-account email `true`, private key `true`.
- Required append range: `Leads!A:O`.
- Sheets smoke result: `API_NOT_ENABLED`, HTTP 403, phase `spreadsheet_access`; no test row was appended.
- Real local `/api/leads` submission: HTTP 502, `stored: false`, development status `rejected`, retryable `true`.
- The UI shows success only for `stored: true`; otherwise it offers retry and WhatsApp.

## Command results

- `npm test`: 23/23 pass.
- `npm run test:gemini`: Interactions OK; `generateContent` OK (before quota exhaustion).
- `npm run test:sheets`: expected external failure `API_NOT_ENABLED`.
- `npm run lint`: no errors; final warning removed.
- `npm run build`: pass; 14 routes generated, both API routes dynamic.
