# Test plan and evidence

## Automated scope
Domain tests: publication filtering, capacity/amenities, exact HTTPS provider host validation, credentials/unsafe URL rejection, contact validation/honeypot, approved-only FAQ search. E2E: German navigation, booking unavailable/no confirmation, unknown FAQ, API validation/origin/size/unavailable behavior, 404/admin closed, responsive overflow and skip navigation. Mock data is not provider verification.

## Release-required tests not yet possible
Administrator-created draft/publish/preview workflow, media backup/restore rehearsal; real galleries/layout against Figma; actual mail delivery and durable rate limiting; Smoobu dates/capacity/minimum stay/fees/taxes/payment/confirmation/provider outage. These need approved content, operator-created admin credentials and an approved provider test procedure.

## Execution record
Pending dependency installation and local execution. Do not interpret written tests as passed tests. Actual command results will be appended.

2026-11-20 foundation verification: 4/4 domain tests passed; TypeScript passed; ESLint passed without warnings; Next.js production build passed. Playwright against local production output: 18/18 passed in 39.8s across desktop/tablet/mobile Chromium (installed Chrome channel). Development-server runs exposed and fixed contact origin and streamed 404 issues; one cold development navigation remained unstable, so CI/browser suite now uses built production output. Smoobu and CMS authentication/publishing remain unverified.

2026-11-20 screenshot-adapted slice: production build including TypeScript passed; ESLint passed without warnings; 4/4 domain tests passed. Final Playwright run against local production build: 24/24 passed in 1.3m, covering desktop/tablet/mobile, capacity/amenity search, mobile navigation, contact validation and error states, 404, approved FAQ fallback, overflow/keyboard skip link and rental-only text across public routes. A select-label naming issue found by the expanded suite was fixed with explicit aria-labelledby. Desktop/tablet/mobile screenshots inspected; final photography/font fidelity remains pending.

2026-11-21 local CMS slice: Payload type generation, TypeScript, ESLint (zero errors), production build and 4/4 domain tests passed. Final desktop Playwright run: 9/9 passed, including the Payload first-administrator form, published-only empty inventory, verified Smoobu Booking Engine URL, contact behavior, 404s and rental-only public text. PostgreSQL ran locally on 127.0.0.1 with persistent ignored storage. Smoobu settings were inspected read-only; Booking Engine URL and apartment IDs were verified, with no live reservation, price, payment or portal changes.

2026-11-21 dynamic-content expansion: Payload type generation, TypeScript, ESLint, 4/4 domain tests and production build passed. The idempotent CMS seed created nine missing drafts on its first run and zero on its second run. The existing owner retained the Administrator role after adding role-based access. Final production-mode desktop Playwright run: 9/9 passed in 1.2 minutes after navigation, footer, contact details, default SEO and all editorial page introductions/sections became CMS-managed.
