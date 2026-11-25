# Vasvi Bali — Portfolio

A single-page, white-and-pink personal portfolio for Vasvi Bali, built with React 19, Vite, Tailwind CSS v4, Framer Motion and Lucide icons. Content is sourced from `Vasvi_Bali_CS-23411359.pdf`.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the production build
```

## Routes

The homepage stays a single page at `/`. Two case studies live on their own routes and reuse the same nav, typography and palette:

- `/projects/edumind` — EduMind case study
- `/projects/sarcasm-detection` — sarcasm detection case study

Routing is a small history-API router in `src/router.tsx` (no extra dependency), with keyword links (`/#projects`) bridging the two. Because this is a client-rendered SPA, the host must serve `index.html` for unknown paths; `npm run dev` and `npm run preview` already do. On a static host without rewrites, add an SPA fallback so deep links like `/projects/edumind` resolve.

## Themes

Light is the default. A moon/sun toggle in the navigation switches to the "Midnight Rose" dark theme on every route; the choice is stored in `localStorage` under `vasvi-theme`, and a small inline script in `index.html` applies it before first paint so returning dark-mode visitors never see a light flash. With no saved choice, the site follows `prefers-color-scheme` and keeps following it until the visitor picks a side.

Switching themes plays a circular reveal from the toggle button. `src/theme.tsx` opens a View Transition, commits the destination theme, then animates a `clip-path` circle on `::view-transition-new(root)` from the button's centre to the furthest viewport corner (820 ms, `cubic-bezier(0.4, 0, 0.2, 1)`). The outgoing theme's snapshot stays underneath, so the new theme is genuinely revealed rather than cross-faded. Browsers without `document.startViewTransition`, and visitors who prefer reduced motion, get the existing short colour transition instead with no ripple.

The palette lives in `@theme` / `.dark` in `src/index.css` and is exposed through semantic utilities: `bg-paper` (page), `bg-surface` (cards and panels), `text-accent` (rose accent text), `text-ink` / `text-muted`, plus the existing `cream`, `blush`, `petal`, `rose` and `rose-deep` scale, which flips wholesale under `.dark`. New components should use these tokens rather than `bg-white` or fixed hex values so they inherit both themes automatically.

## Ambient music player

A small fixed player sits in the bottom-right corner on every route. It tries to start the local soundtrack automatically on load and loops it continuously. The category is chosen from the visitor's local time (morning 06:00–11:59, afternoon 12:00–16:59, evening 17:00–20:59, night 21:00–05:59). Browsers block audible autoplay until the visitor interacts with the page, so a rejected start waits for the first click or key press and then begins; a manual track choice or pause is kept while they browse — including across the homepage and project routes, because the player is mounted once above the router.

Tracks are mapped in `src/music.ts`. Upload audio to `public/music/<category>/`, then add entries with `id`, `title`, `src` and `category`; see `public/music/README.md`. The four uploaded tracks are registered there, and `src` is the browser path (`/music/...`) with spaces and brackets percent-encoded — never `public/`, and never a raw filename with spaces. A missing file produces a short inline message instead of a console-only failure.

## Structure

- `src/data.ts` — all resume-sourced content (skills, experience, projects, achievements, certifications)
- `src/router.tsx` — history-API router, `Link` and view-transition navigation
- `src/music.ts` — time windows and the editable track manifest
- `src/components/MusicPlayer.tsx` — persistent ambient player mounted above the router
- `src/pages/` — `HomePage`, the two project case studies, and the 404 route
- `src/components/project/` — case-study chrome, section frames, interactive architecture / training diagrams, attribution block
- `src/components/` — one component per section, plus shared reveal/heading primitives
- `src/components/motion-kit.tsx` — the motion language: word reveals, magnetic buttons, hand-drawn underlines, pink motes
- `src/components/CatCursor.tsx`, `SkillConstellation.tsx`, `PetalPixelDivider.tsx`, `WaveDivider.tsx`, `Preloader.tsx` — signature interaction pieces
- `public/images/portrait.jpg` — portrait extracted from the resume
- `public/images/cursor-cat.jpg` — the custom cursor image (shown in a round frame)
- `public/images/edumind-copyright-certificate.png` — the Copyright Office registration certificate reproduced in the EduMind attribution section
- `public/images/edumind-dashboard.webp`, `public/images/sarcasm-detector-dashboard.webp` — the supplied project dashboard screenshots used as homepage previews
- `public/Vasvi_Bali_Resume.pdf` — downloadable resume

## Intentional placeholders

Project previews use the dashboard screenshots supplied for EduMind and Sarcasm Detection. Metrics and repository URLs are not invented: GitHub links read "available on request" until real URLs are supplied. Update `PROJECTS[].github` in `src/data.ts` when those are available; the preview images are set by `PROJECTS[].image` and `imageAlt`.

## Accessibility & motion

The site uses semantic landmarks, a skip link, visible focus states, labelled icon links, and readable contrast. All entrance, floating, tilt and marquee motion is disabled or simplified under `prefers-reduced-motion`. On fine-pointer devices the cat photo at `public/images/cursor-cat.jpg` replaces the native cursor, with a pink sparkle trail following it; the cat grows over links and squishes on click. If the image fails to load, the normal pointer comes back. The skill chart is drawn as the Virgo asterism (Spica anchored on Python); hovering or tapping a star blurs the rest of the sky and opens a panel with the internships, projects and research that used it — the same copy lives in `SKILL_DETAILS` in `src/data.ts`. The cat cursor and its sparkle trail, magnetic buttons and portrait tilt only run on fine-pointer devices and stay off for reduced-motion users; other particle effects are pure CSS transforms, and the sparkle canvas parks its animation loop when no particles remain.
