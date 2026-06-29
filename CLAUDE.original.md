# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KaEatSaan ("Where to eat?") is a Next.js app that helps users decide where to eat using a roulette wheel. Built with React 19, TypeScript, MUI 7, Tailwind CSS v4, and Firebase (Auth + Realtime Database). Deployed as a static export to Firebase Hosting.

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build (static export)
npm run lint       # ESLint v9 (flat config in eslint.config.mjs)
```

No test framework is configured. The project uses semantic-release for automated versioning on `main` (production) and `develop` (beta pre-releases).

## Architecture

### Routing & Pages (Next.js App Router)

`/app` uses static export (`output: 'export'` in next.config.ts). All pages are client-side rendered. Key routes: home (roulette wheel), `/favorites`, `/history`, `/filters`.

`next.config.ts` also injects `NEXT_PUBLIC_APP_VERSION` from `package.json` at build time.

### State Management (Zustand)

Each domain has its own Zustand store in `/lib/store/`. Several stores use `persist()` middleware with localStorage keys prefixed `kaetsaan-` (e.g., `kaetsaan-filters`). Stores contain both state and actions in a single `create()` call.

- `authStore` - Firebase Google Sign-In
- `foodOutletStore` - CRUD operations against Firebase Realtime Database
- `filtersStore` / `favoritesStore` / `historyStore` / `locationStore` - Persisted client-side state
- `reviewStore` - Reviews from Firebase
- `uiStore` - Transient UI state

### Data Flow

Firebase Realtime Database is the source of truth for food outlets and reviews. `/lib/constants/foodOutlets.ts` holds static seed data. Custom hooks in `/hooks/` orchestrate fetching, filtering, and distance calculation:

- `useFoodOutlets` — fetch & filter outlets from Firebase
- `useGeolocation` — user location via browser API
- `useReviews` — fetch reviews from Firebase
- `useWheel` — wheel animation state & selection logic

Filtering and distance computation (`/lib/utils/distance.ts`, `/lib/utils/geocoding.ts`) happen client-side in memory.

### Component Organization

Components in `/components/` are grouped by feature: `wheel/`, `layout/`, `auth/`, `food_outlet/`, `filters/`, `map/`, `reviews/`. All interactive components use `"use client"` directive. UI is built exclusively with MUI components + Tailwind CSS utilities. `AuthProvider` wraps the app for Firebase auth context.

Map functionality uses Leaflet + react-leaflet. Framer Motion handles UI animations (separate from the canvas wheel animation).

### Wheel Implementation

The roulette wheel uses HTML Canvas (`/lib/utils/canvasHelpers.ts`) with `requestAnimationFrame` animation and ease-out-cubic easing (`/lib/utils/wheelAnimation.ts`). The selected result is calculated from the exact final rotation angle, not random selection.

### Types

TypeScript interfaces live in `/types/` — `FoodOutlet`, `FilterState`, `HistoryEntry`, `Review`, `UserLocation`. Path alias `@/*` maps to the project root.

## Conventions

- **Commits**: Conventional Commits format (`feat:`, `fix:`, `chore:`, `docs:`)
- **Branches**: `main` (production), `develop` (development), feature/fix branches named `feature/name` or `fix/name`
- **Styling**: MUI theme with custom orange primary `#FF6B35`, warm beige backgrounds `#FAF9F7`, Montserrat font. Mobile-first responsive design. Tailwind v4 — no `tailwind.config.js`; config lives in CSS via `@theme`.
- **Firebase**: Lazy initialization with `getApps()` check. Real-time listeners with unsubscribe cleanup.
- **Persistence**: History auto-cleans entries older than 30 days, max 100 entries.

## Environment Variables

All public Firebase config vars are prefixed `NEXT_PUBLIC_FIREBASE_*` and stored in `.env.development`, `.env.production`, and `.env.local`. `NEXT_PUBLIC_APP_VERSION` is injected automatically at build time from `package.json`.

## Deployment

GitHub Actions deploys `main` to production (`kaeatsaan.web.app`) and `develop` to dev (`dev-kaeatsaan.web.app`). Both workflows run semantic-release, build, deploy to Firebase Hosting, and send Discord notifications.
