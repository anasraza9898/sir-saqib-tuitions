# AI Conversation QA

Date: 2026-08-13  
Environment: local Next.js dev server at `http://127.0.0.1:3000`  
Deployment: not performed

## Root-Cause Audit

The unacceptable replies came from the assistant orchestration treating deterministic keyword/fact lookup as a reply brain. The broad local knowledge path selected large blocks such as all programmes, all fees, or generic campus/timetable guidance, then those blocks were used as final answers or as schema fallbacks. That made greetings, names, fee questions and timing questions behave like keyword matches instead of context-aware admissions conversation.

The redesigned path keeps deterministic logic for validation, state extraction, security blocks, fact selection, exact fee calculation, action validation and provider-failure fallback. Gemini receives compact conversation state plus only the relevant verified facts for the latest turn, and Gemini composes the normal visible reply.

## Current Pipeline

1. Client sends the recent chronological transcript plus deterministic lead draft state.
2. Route validates shape, rate limits and body size.
3. Explicit visitor state is extracted: name, role, class, stream, gender/campus, timing preference and question.
4. Intent classification selects relevant facts only; it does not produce the ordinary final reply.
5. Gemini receives principle-based admissions instructions, compact state and the selected fact context.
6. Structured output is optional except for `message`; Zod validates metadata and safe actions.
7. If structured parsing fails, recover the textual model answer when possible.
8. Deterministic text is used only for prompt/safety blocks, missing Gemini configuration, quota/provider failure, or infrastructure failure.

## Timetable Handling

The current verified timetable source contains official poster records for Grades IX-XII, class, stream and variant. No verified machine-readable day/time transcription is installed in `timetableSchedules`, so the assistant must not quote days, subjects or times from memory or images.

Behavior verified:

- `Class 9 ki timing kya hai?` asks only for missing campus/gender and programme.
- `Boys Class 9 Science Group A ki timing?` returns the exact official poster route for `ix-science-group-a`.
- General schedule questions with multiple variants ask for the missing batch/timing.
- Campus enquiry hours remain separate from class timetables.

## Faculty, Results And Media

Faculty answers are limited to the verified roster. Sir Saqib Zaki is answered as `CAT, B.Com, MBA` with 24 years of experience. Mathematics faculty returns Sir Muhammad Armash and Sir Shahid Punal only.

Results route to verified 2026 or 2025 result poster categories without inventing marks or guarantees. Media requests route to `/media` with relevant verified video categories such as Classroom Learning, Boys Campus, Results, Academy Introduction and Testimonials.

## Live API QA

Command: `node scripts/test-conversation-api.mjs`  
Result: `34/34` passed.

The first live requests reached Gemini successfully. During the burst test, Gemini returned sanitized `429 QUOTA_EXCEEDED` diagnostics, so later cases used the local emergency fallback. The fallback now preserves direct facts and safe actions instead of broad canned blocks.

Covered cases:

| # | Case | Result |
|---:|---|---|
| 1 | Roman Urdu name introduction | Pass |
| 2 | English name introduction | Pass |
| 3 | Urdu-script greeting with Roman Urdu output | Pass |
| 4 | Class 9 fee | Pass |
| 5 | Misspelled Class 9 fee | Pass |
| 6 | Urdu-script Class 9 fee | Pass |
| 7 | Class 9 starting total | Pass |
| 8 | Sibling discount | Pass |
| 9 | Ambiguous Class 9 timing | Pass |
| 10 | Boys IX Science Group A poster route | Pass |
| 11 | Follow-up class/stream/group timing context | Pass |
| 12 | Girls IX General ambiguous variant | Pass |
| 13 | Boys Campus enquiry hours | Pass |
| 14 | Sunday hours confirmation | Pass |
| 15 | O Levels availability | Pass |
| 16 | O Levels fee | Pass |
| 17 | O Levels subjects | Pass |
| 18 | Class 9 board/curriculum | Pass |
| 19 | Sir Saqib experience | Pass |
| 20 | Mathematics faculty | Pass |
| 21 | Miss Javeria qualification | Pass |
| 22 | Van to Gulshan | Pass |
| 23 | Online classes | Pass |
| 24 | Trial/demo class | Pass |
| 25 | Admission documents | Pass |
| 26 | Latest results | Pass |
| 27 | 2025 results | Pass |
| 28 | Classroom video | Pass |
| 29 | Girls Campus address | Pass |
| 30 | Medical advice boundary | Pass |
| 31 | Prompt injection | Pass |
| 32 | Serious callback intent | Pass |
| 33 | Repeated Class 9 fee | Pass |
| 34 | Campus correction follow-up | Pass |

## Google Sheets And Leads

Credential presence from `.env.local` was reported as booleans only:

- `GOOGLE_SHEET_ID`: true
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: true
- `GOOGLE_PRIVATE_KEY`: true

Command: `npm run test:sheets`  
Result: success. The script authenticated, verified spreadsheet access, verified the `Leads` tab, and appended to `Leads!A:O` with marker `TEST LEAD — DELETE ME`.

Lead form API test:

- Endpoint: `POST /api/leads`
- Status: `200`
- Response status: `submitted`
- `stored`: true
- `developmentStatus`: `stored`

The current local root cause for "leads not appearing" is not a Sheets adapter failure. The confirmed behavior is that typing a name and phone in chat does not write a row. A row is written only after the guided lead form is submitted with valid required fields and explicit consent.

## Command Results

- `npm test`: 26/26 pass.
- `npm run test:gemini`: Interactions OK; `generateContent` OK for `gemini-3.6-flash`.
- `npm run test:sheets`: OK; appended test row to `Leads!A:O`.
- `npm run lint`: pass.
- `npm run build`: pass; 16 static pages generated, both API routes dynamic.
