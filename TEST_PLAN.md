# Test plan and evidence

## Automated scope
Domain tests: publication filtering, capacity/amenities, exact HTTPS provider host validation, credentials/unsafe URL rejection, contact validation/honeypot, approved-only FAQ search. E2E: German navigation, booking unavailable/no confirmation, unknown FAQ, API validation/origin/size/unavailable behavior, 404/admin closed, responsive overflow and skip navigation. Mock data is not provider verification.

## Release-required tests not yet possible
CMS anonymous/draft/mutation authorization, admin login/publishing/preview, restore rehearsal; real galleries/layout against Figma; actual mail delivery and durable rate limiting; Smoobu dates/capacity/minimum stay/fees/taxes/payment/confirmation/provider outage. These need implementation/configuration/access and an approved provider test procedure.

## Execution record
Pending dependency installation and local execution. Do not interpret written tests as passed tests. Actual command results will be appended.

2026-11-20 foundation verification: 4/4 domain tests passed; TypeScript passed; ESLint passed without warnings; Next.js production build passed. Playwright against local production output: 18/18 passed in 39.8s across desktop/tablet/mobile Chromium (installed Chrome channel). Development-server runs exposed and fixed contact origin and streamed 404 issues; one cold development navigation remained unstable, so CI/browser suite now uses built production output. Smoobu and CMS authentication/publishing remain unverified.

2026-11-20 screenshot-adapted slice: production build including TypeScript passed; ESLint passed without warnings; 4/4 domain tests passed. Final Playwright run against local production build: 24/24 passed in 1.3m, covering desktop/tablet/mobile, capacity/amenity search, mobile navigation, contact validation and error states, 404, approved FAQ fallback, overflow/keyboard skip link and rental-only text across public routes. A select-label naming issue found by the expanded suite was fixed with explicit aria-labelledby. Desktop/tablet/mobile screenshots inspected; final photography/font fidelity remains pending.
