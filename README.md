# Sir Saqib Tuitions Website

Version 2 of the production website for Sir Saqib Tuitions in Karachi. The build uses the Next.js App Router, TypeScript, Tailwind CSS, Framer Motion and Lucide React. Business content is centralized in `src/data/site.ts`; interactions use lightweight custom components and verified academy media only.

## Setup

Requirements:

- Node.js 20.9 or newer
- npm

```bash
npm install
npm run assets
npm run dev
```

Open `http://localhost:3000` after the development server starts.

## Commands

```bash
npm run dev       # Start local development
npm run lint      # Run ESLint and Next.js rules
npm run build     # Create the production build
npm run start     # Serve the production build
npm run assets    # Copy the controlled optimized asset manifest
```

## V2 Architecture

- Server Components remain the default across all routes.
- `ClientProviders` supplies user-preference motion handling and the single-active-media controller.
- `PremiumVideo` provides poster-first playback, custom sound/play/fullscreen controls and mobile-safe hero behavior.
- Motion primitives live in `src/components/motion-system.tsx` and respect `prefers-reduced-motion`.
- Programs, campuses, faculty, results, timetables, media and FAQs live in `src/data/site.ts`.
- Interactive result, timetable, media and contact experiences render only the active media state.
- Native metadata, sitemap, robots, organization/location JSON-LD, FAQ JSON-LD and breadcrumb JSON-LD cover search requirements.

## Final Asset Workflow

Final HD videos are loaded from stable slots under `public/assets/final/videos`.
Add the approved files with these exact names, commit and redeploy. No code
change is required:

- `academy-introduction.mp4`
- `girls-campus.mp4`
- `boys-campus.mp4`
- `classroom-learning.mp4`
- `results.mp4`
- `testimonials.mp4`

Final timetable posters are copied from `../02-website-assets/images/timetables`
through `npm run assets` and loaded from stable slots under
`public/assets/timetables/official`. Use the slot names referenced by
`src/data/site.ts`, for example:

- `grade-ix-general-group-a.png`
- `grade-ix-general-morning.png`
- `grade-x-science-group-b.png`
- `grade-xi-commerce-evening.png`
- `grade-xii-science-main.png`

The website must expose only the approved official timetable image entries in
`src/data/site.ts`.

## Deployment

The project is compatible with Vercel's standard Next.js flow:

1. Set the project root to `04-project-code`.
2. Use `npm run build` as the build command.
3. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin. Vercel's production URL is used as a fallback when available.
4. Do not expose server credentials through `NEXT_PUBLIC_*` variables.

## Content Guardrails

- Keep the published ranges at Grades I-VIII, Matric, Intermediate and Huffaz.
- Do not add ratings, student totals, awards, affiliations or performance percentages without approval.
- Direct fees, exact timings, registration documents and trial-class questions to admissions.
- Keep 2026 results separate from the previous 2025 collection.
