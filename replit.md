# PAUDIT v1.0 — Rutas Patrimoniales Accesibles

## Overview
PAUDIT is a mobile-first, accessible web platform for publishing cultural heritage routes with multimedia content: text, audio guides with transcriptions, and Spanish Sign Language (LSE) video with transcripts/subtitles. All content is in Spanish.

## Architecture
- **Frontend**: React + Vite + Tailwind CSS v4 + wouter routing
- **Backend**: Express.js (thin API layer, no database)
- **Content**: Static JSON files in `client/public/content/`
- **Persistence**: No database. Content served from filesystem. User accessibility preferences stored in `localStorage`.

## Content Structure
- `client/public/content/routes.json` — Index of all routes (2 routes)
- `client/public/content/routes/{slug}.json` — Individual route data with stops, multimedia URLs, and `_help` documentation fields

## API Endpoints
- `GET /api/routes` — Returns all route summaries
- `GET /api/routes/:slug` — Returns full route detail with stops (strips `_help` field)

## Key Files
- `shared/schema.ts` — Zod schemas for RouteSummary, RouteDetail, Stop
- `server/storage.ts` — FileStorage class that reads JSON from disk
- `server/routes.ts` — Express API routes
- `client/src/context/AccessibilityContext.tsx` — Global accessibility state (text size, contrast, subtitles, easy read)
- `client/src/components/Navigation.tsx` — Header + mobile bottom nav
- `client/src/components/AccessibilityModal.tsx` — Settings dialog

## Pages
- `/` — Home with hero, search, featured routes
- `/rutas` — Route listing with cards
- `/rutas/:slug` — Route detail with stop list
- `/rutas/:slug/:stopId` — Stop detail (audio player, LSE video, transcriptions)
- `/accesibilidad` — Accessibility commitment page

## Accessibility Features
- WCAG AA compliance target
- Keyboard navigation with visible focus rings
- Skip-to-content link
- Semantic HTML (landmarks, headings, ARIA)
- Text size: Normal / Large / XL
- Contrast modes: Standard Dark / High Contrast Black / High Contrast White
- Subtitle toggle, Easy Read preference
- All preferences saved to localStorage
- Font: Atkinson Hyperlegible (designed for legibility)

## Design
- Dark theme by default (cultural tourism aesthetic)
- Mobile-first, responsive layout
- Bottom navigation bar on mobile
- Sticky headers for route/stop navigation
