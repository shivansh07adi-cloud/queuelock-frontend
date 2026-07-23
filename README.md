# FlashBook frontend

Next.js frontend for FlashBook - talks to the backend API from Phases 1-5.

## What's here

- **Home page** (`/`) - live drops shown in a "dome gallery" (cards arranged
  along a shallow 3D arc), a curved marquee banner, a nav with a flowing
  hover highlight.
- **Drop detail** (`/drops/[id]`) - the full flow: join the waiting room,
  watch your queue position, get admitted, book, pay. The slots-remaining
  counter is a split-flap departure-board style display (`FlapCounter`) -
  each digit flips independently when the value changes.
- **Login** (`/login`) - register or log in.
- **Admin** (`/admin`) - create a drop and open it for booking. Your account
  needs `role = 'admin'` in the database (see the backend README for how to
  promote yourself).

## The custom effects, and where they live

| Effect | File | What it does |
|---|---|---|
| Splash cursor | `src/components/SplashCursor.tsx` | Custom cursor with expanding ripple trails on move/click |
| Flowing menu | `src/components/FlowingMenu.tsx` | Nav highlight that morphs and slides between hovered items |
| Curved loop | `src/components/CurvedLoop.tsx` | Marquee text scrolling along an arc (SVG `textPath` + SMIL) |
| Dome gallery | `src/components/DomeGallery.tsx` | Drop cards arranged in a shallow 3D arc |
| Pixel transition | `src/components/PixelTransition.tsx` | Tile-dissolve reveal, used when the slot counter changes |
| Flap counter | `src/components/FlapCounter.tsx` | The signature element - split-flap digit display |
| Ambient background | `src/components/AmbientBackground.tsx` | Slow-drifting canvas light beams instead of a static background |

All of these respect `prefers-reduced-motion` where it matters (the ambient
background and splash cursor turn off entirely).

## Setup

1. Make sure the backend (Phase 5 zip) is running locally on port 4000.

2. Install dependencies:
   ```
   npm install
   ```

3. Copy the env file:
   ```
   cp .env.local.example .env.local
   ```
   `NEXT_PUBLIC_API_URL` should point at your running backend
   (`http://localhost:4000` by default).

4. Run it:
   ```
   npm run dev
   ```
   Open http://localhost:3000

## A note on fonts

This uses `next/font/google` (Space Grotesk, IBM Plex Mono, Inter), which
downloads and self-hosts the fonts at build time - completely standard and
automatic, no separate setup needed. It just requires normal internet access
to `fonts.googleapis.com` the first time you build, which your machine will
have (this was only an issue in the sandbox I built this in, which has a
restricted network allowlist).

## Trying the full flow

1. Register/log in as a normal user in one browser tab.
2. In another tab (or after promoting yourself to admin), go to `/admin`,
   create a drop, click "Go live now."
3. Back on the drop's page as a regular user, click "Join the waiting room" -
   you'll either get admitted immediately or see your queue position update
   live.
4. Once admitted, click through to book, then pay. Watch the flap counter
   tick down and the pixel-dissolve transition play.
5. Open the same drop in several browser tabs/incognito windows logged in as
   different users and try to exhaust the slots at once - the same
   no-overselling guarantee from the backend tests holds here too.

**Built by [Shivansh Kumar](https://github.com/shivansh07adi-cloud)**
