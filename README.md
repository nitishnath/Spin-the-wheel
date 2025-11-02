# Arkain Games – Spin-the-Wheel Mini App

A modern, mobile-first React mini‑app where authenticated users play a deterministic “Spin‑the‑Wheel”, see wallet points, and view rewards history. Built with Vite, Redux Toolkit, MSW, and tested with Vitest + React Testing Library.

## Setup & Running

- Prereqs: Node `>=18` (tested on Node 18), npm.
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Run tests: `npm test`
- Build for production: `npm run build` then `npm run preview`

## App Overview

- Authentication: Mocked OTP flow. Enter 10‑digit mobile → fixed OTP `123456`.
- Dashboard: Shows user (name, mobile), wallet points, and action cards.
- Game: One play per login session; deterministic reward via mock API.
- Rewards History: Real‑time updates after playing; status chips and timestamps.
- Accessibility: Keyboard‑navigable, ARIA labels, and reduced‑motion support.

## Architecture

- `src/store/` – Redux store with minimal localStorage persistence for session.
  - Slices: `authSlice` (auth + sessionPlayed), `walletSlice` (points), `rewardsSlice` (list)
- `src/pages/` – Route pages: `Login`, `OTP`, `Home`, `Play`, `Rewards` via React Router.
- `src/components/SpinWheel.jsx` – Accessible wheel with `prefers-reduced-motion` handling.
- `src/mocks/` – MSW handlers for `login`, `verify-otp`, `profile`, `wallet`, `rewards`, `game/play`.
- `src/lib/reward.js` – Deterministic reward logic (sum of digits modulo pool size).
- Styling: `src/styles/app.scss` – Mobile‑first SCSS with clean visuals.

### Data Flow

- Login → `POST /api/login` saves mobile to state → OTP page
- OTP verify → `POST /api/verify-otp` returns user → load wallet (`GET /api/wallet`) and rewards (`GET /api/rewards`) → Dashboard
- Play → Wheel animation (respect reduced motion) → `POST /api/game/play` → store updates `rewards` and `wallet` → Toast and Rewards page reflect changes
- Session rule: `auth.sessionPlayed` toggles after play; Play card disables until logout.

## Testing

- Unit tests: Reward logic (`src/lib/reward.test.js`) and `authSlice` reducers (`src/features/authSlice.test.js`).
- Integration: Main app flow (`src/app.integration.test.jsx`) covers login → otp → play → view reward.
- Config: Vitest with `jsdom` in `vite.config.js`; MSW node server set up via `src/setupTests.js`.

## Accessibility & UX

- Visible focus states driven by browser defaults + button styles.
- Keyboard: Tab to controls; `Enter/Space` on the Spin button works.
- ARIA: Labels on forms, `role="alert"` toasts, `aria-live` for points.
- Reduced motion: Skips animation and completes immediately when enabled.

## Trade‑offs & Known Gaps

- No real backend or secure auth; MSW mocks only.
- Deterministic reward is simple (digit sum); can be replaced with server logic.
- Error handling is basic; user‑facing toasts only, per scope.

## Time Log

- Day 1: folder structure and planned the UI design and BE API design with MSW, install all dependencies packages, routing
- Day 2: redux toolkit, slices, login functionality, dashboard, session rule, spin wheel main functionality, unit + integration testing, refinements etc.
