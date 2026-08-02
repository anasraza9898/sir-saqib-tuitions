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
- Programs, campuses, faculty, results, timetables, media, FAQs and assistant answers live in `src/data/site.ts`.
- Interactive result, timetable, media and contact experiences render only the active media state.
- Native metadata, sitemap, robots, organization/location JSON-LD, FAQ JSON-LD and breadcrumb JSON-LD cover search requirements.

## Asset Workflow

`scripts/copy-assets.mjs` uses a fixed source-to-destination map. It reads only from `../02-website-assets`, copies 44 website-ready files into `public/assets`, rejects destination collisions and never writes to `01-original-assets` or `02-website-assets`.

The hero source is the real speaking introduction video:

`public/assets/videos/hero/sir-saqib-introduction.mp4`

Six lightweight WebP video posters in `public/assets/posters/video` were captured from the real optimized academy videos. `public/assets/paper-noise.png` is a tiny local texture. These derived files are already part of the public build and do not use stock imagery.

## Deployment

The project is compatible with Vercel's standard Next.js flow:

1. Set the project root to `04-project-code`.
2. Use `npm run build` as the build command.
3. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin. Vercel's production URL is used as a fallback when available.
4. Do not expose server credentials through `NEXT_PUBLIC_*` variables.

## Future AI and Leads

The current admission assistant is deterministic and reads verified local content only. It does not call Gemini, persist leads or display a fake saved state.

A later phase should add a server-only adapter behind a Route Handler or Server Action. It should validate and rate-limit requests, keep Gemini and Google credentials in server-only variables, ground answers in the existing content model, obtain consent before capture, confirm persistence before showing success, and update the privacy notice.

## Content Guardrails

- Keep the published ranges at Grades I-VIII and Grades IX-XII.
- Do not add O Levels until the client confirms the programme.
- Do not add ratings, student totals, awards, affiliations or performance percentages without approval.
- Direct fees, exact timings, registration documents and trial-class questions to admissions.
- Keep 2026 results separate from the previous 2025 collection.
