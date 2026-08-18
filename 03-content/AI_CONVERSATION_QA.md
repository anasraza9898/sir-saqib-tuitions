# AI Conversation QA

Date: 2026-08-18
Environment: local workspace only
Deployment: not performed

## Focused Regression Audit

The final QA pass targeted real conversation failures observed after Groq was already connected.

Remaining issues found:

1. Greeting and welcome text repeated because the AI prompt and backup guidance did not receive explicit conversation behavior state.
2. Visitor names were overused because the system knew the name but did not track whether the assistant had already acknowledged it.
3. Result availability contradicted itself because resource existence was left to model phrasing and loose intent selection.
4. "Official website" and campus-visit fallbacks appeared because resource answers were not tied to deterministic actions before generation.
5. "Class 9 Science group ka result" was incorrectly vulnerable to timetable classification because `group` had higher priority than explicit `result`.
6. "Result dikhao" was too broadly classified as media because result poster and result-video requests were mixed.

## Architecture Changes

- Added a verified resource registry in `src/lib/ai/resource-registry.ts` for result, timetable, video and page resources.
- Added conversation behavior state: greeted, assistant greeting count, visitor-name acknowledgement and visitor-name use count.
- Added Group A/B to sanitized lead/conversation state so timetable follow-ups like `group b` resolve naturally.
- Passed conversation behavior state into Groq system instructions and Local Guidance.
- Tightened Groq instructions: user is already on this website, never invent a vague official website, do not over-greet, do not overuse names, and use verified actions when available.
- Updated Local Guidance to use the same resource registry and avoid contradictory result/timetable/media availability claims.
- Reprioritized explicit result intent above timetable group terms.
- Separated result poster requests from result-video/media requests.
- Broadened name recognition for real Roman Urdu input such as `mera name anas hay`.

## Verified Resource Registry

2025 result resources actually present in project metadata:

- Boys Campus XI-XII Groups: `/assets/results/boys-xi-xii-groups-2025.webp`, route `/results`
- Boys Campus IX-X Matric: `/assets/results/boys-ix-x-matric-2025.webp`, route `/results`
- Girls Campus XI-XII Groups: `/assets/results/girls-xi-xii-groups-2025.webp`, route `/results`
- Girls Campus IX-X Matric: `/assets/results/girls-ix-x-matric-2025.webp`, route `/results`

2026 result resources actually present:

- Boys Campus Matric - Science & General: `/assets/results/boys-matric-science-general-2026.webp`, route `/results`
- Girls Campus Matric - General: `/assets/results/girls-matric-general-2026.webp`, route `/results`
- Girls Campus Matric - Science: `/assets/results/girls-matric-science-2026.webp`, route `/results`
- Girls Campus Matric - Science II: `/assets/results/girls-matric-science-2-2026.webp`, route `/results`

Timetable resources verified:

- Grade IX Science Group A: `/assets/timetables/official/grade-ix-science-group-a.png`
- Grade IX Science Group B: `/assets/timetables/official/grade-ix-science-group-b.png`
- Remaining Grade IX-XII timetable posters from `src/data/site.ts`

Media resources verified:

- Academy Introduction, Girls Campus, Boys Campus, Classroom Learning, Results and Testimonials videos, all routed through `/media`.

## Resource Resolution Rules

- `EXACT_RESOURCE_AVAILABLE`: answer action-first and return the exact route action.
- `CATEGORY_RESOURCE_AVAILABLE`: state that the exact item is not individually mapped, then return the verified broader section/category action.
- `NO_VERIFIED_RESOURCE`: state that the exact resource is not in current verified data and offer appropriate confirmation.

Groq receives the resource status and recommended action as explicit context. It does not decide availability from imagination.

## Timetable Behavior

If class, stream and group are known, the assistant returns the exact timetable action. For Grade IX Science Group B, the action is `Open Group B Timetable` with `/timetables?class=9&stream=science&batch=ix-science-group-b`.

If class/stream are known but group is missing, the assistant asks only for Group A or Group B. It does not answer with enquiry office hours and does not recommend a campus visit for online timetable access.

## Results Behavior

Generic `2025 result` requests resolve to `Open 2025 Results`.

Class 9 Science result requests resolve to the verified Results section/category rather than falsely claiming a separately mapped public Class 9 Science result exists. Follow-ups like `yahi dikhao` keep the same category status and action, so availability does not flip to unavailable.

## Sales-Agent Behavior

Sales moments are now proof-driven:

- Results questions surface result actions.
- Timetable questions surface timetable actions.
- Video/classroom questions surface media actions.
- Known fee questions answer directly.
- Campus visits are reserved for admission completion, seat availability or unverified physical/administrative details.

## QA Coverage

- Single-turn academy probes tested: 165.
- Multi-turn conversation scenarios tested: 20.
- Focused real-conversation regression tested: 8 turns.
- Total deterministic AI tests: 36.

Major focused failures discovered and fixed:

- `mera name anas hay` was not classified as an introduction.
- `class 9 science group ka result` was routed as timetable instead of results.
- `mujhy 9 class ka result yahi dikhao nah` was routed as media instead of results.
- Exact timetable resources returned internal registry facts instead of natural action text.
- Older timetable tests expected retired fact wording rather than the new registry status.

## Command Results

- `npm.cmd test`: pass, 36/36 tests.
- `npm.cmd run test:groq`: pass. Groq API OK, model `openai/gpt-oss-20b`, structured response OK.
- `npm.cmd run test:sheets`: pass. Credentials detected as present, spreadsheet access OK, append range `Leads!A:O`, smoke append OK.
- `npm.cmd run lint`: pass.
- `npm.cmd run build`: pass. Next build generated 16 static pages; `/api/ai/chat` and `/api/leads` remain dynamic.

## Local Run Command

Run manually:

```bash
npm run dev
```
