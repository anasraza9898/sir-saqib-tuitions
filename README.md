# Sir Saqib Tuitions Website

Production-ready website for Sir Saqib Tuitions in Karachi. The application uses the Next.js App Router, TypeScript, Tailwind CSS, Framer Motion and Lucide React. Business content is centralized in `src/data/site.ts`, and all public media is copied from the optimized `02-website-assets` source through an explicit manifest.

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
npm run dev       # Local development server
npm run lint      # ESLint and Next.js rules
npm run build     # Production build
npm run start     # Run the production build
npm run assets    # Copy and normalize optimized academy assets
```

## Asset Workflow

`scripts/copy-assets.mjs` uses a fixed source-to-destination map. It reads from `../02-website-assets` and copies only optimized files into `public/assets`. The script never writes to `01-original-assets` or `02-website-assets`, checks target paths, and rejects destination name collisions.

`public/assets/posters/hero-video-poster.webp` is a lightweight fallback frame derived from the optimized hero video. It keeps the hero stable when autoplay is unavailable without introducing external imagery.

## Deployment

The project is compatible with Vercel's standard Next.js deployment flow.

1. Set the project root to `04-project-code`.
2. Use `npm run build` as the build command.
3. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin so canonical, Open Graph, sitemap and structured-data URLs use the production domain.
4. Deploy without exposing server secrets to `NEXT_PUBLIC_*` variables.

## Future AI and Lead Architecture

The current admission assistant is deterministic and uses verified local content only. It does not call Gemini or save leads.

A later phase should add a server-only adapter behind a Route Handler or Server Action:

- Validate and rate-limit requests on the server.
- Keep Gemini and Google service credentials in server-only environment variables.
- Ground Gemini responses in the same verified content model.
- Require explicit consent before lead capture.
- Write to Google Sheets through a restricted service account or a dedicated lead service.
- Return honest success and error states only after the server confirms persistence.
- Update the privacy notice before enabling storage.

## Content Rules

- Do not add ratings, student counts, awards, affiliations or performance statistics without verification.
- Confirm fees, exact timings, registration documents and trial-class details directly with admissions.
- Keep 2026 results separate from previous 2025 highlights.
