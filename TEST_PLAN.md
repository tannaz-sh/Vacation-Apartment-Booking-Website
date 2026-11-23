# Test plan and evidence

## Latest review: 2026-11-23

See QUALITY_REVIEW.md for task-specific scores and release blockers.

| Check | Actual result |
| --- | --- |
| Frozen dependency install, typecheck, lint, production build | Passed |
| Domain tests (`pnpm test`) | 8 passed |
| Real isolated PostgreSQL + built HTTP CMS (`pnpm test:cms`) | 37 assertions passed |
| HTTP-only Playwright selection | 21 passed (7 scenarios × 3 project names, not device UI tests) |
| Cloud Browser Smoobu search | Form loaded and searched for 23–24 November 2026 / one guest within own page; no availability found, no booking or charge submitted |
| Cloud Browser support panel | Empty state, topic/answer expansion, draft exclusion, page scope, focus/Escape and contact link verified |
| Admin page rendering | Authenticated dashboard/list/create/edit output and anonymous redirection pass HTTP checks; interactive form editing remains unverified |
| Full automated UI/mobile/tablet suite | Blocked by Chromium socket EPERM; not reported as passed |
| New CMS UI suite setup/discovery (`pnpm test:cms:ui -- --list`) | Passed: real migration, disposable admin, 3 device-project cases and cleanup; browser assertions have not run |

Run CMS checks only after a production build and only with a dedicated local
`support_review_test` database. The suite runs migrations, creates synthetic
records, verifies local/API access and cookie auth/CSRF, and cleans up its records.
Do not use a customer database. CI now provisions disposable PostgreSQL.

Run `TEST_DATABASE_URL=.../support_review_test pnpm test:cms:ui` for actual
admin-form tests across desktop, tablet and mobile. The runner creates a unique
synthetic administrator, passes temporary credentials only in the child process
environment and removes its own test records afterward. Tracing/video are off;
no auth state file is saved. All topic and question mutations use the real UI.
Tests verify draft privacy, publication, edits, individual-question removal,
unpublication/deletion, page scope, FAQ reuse and long-answer panel bounds.

HTTP selection used:
`pnpm exec playwright test --grep 'contact rejects|contact accepts|contact API|all public routes|unconfigured CMS'`

New browser tests cover support keyboard/focus behavior, narrow panel bounds,
widget load/failure with a deterministic script harness and no top-level redirect.
The script harness is not proof of provider behavior. Initial real provider load
was separately checked manually. The complete automated suite still needs a
browser-capable runner. Never disable isolation to manufacture a passing run.

The 23 November continuation reran a targeted UI case after the environment
restart; Chromium still failed before application assertions (socket EPERM).
Extended CMS checks additionally cover protected page rendering, anonymous
administrator/version/draft access and unauthenticated HTTP edits/deletes. Tests
account for Next streamed redirects and browser Fetch Metadata on navigation;
no application access controls were weakened to make them pass.

## Release-required acceptance still open

Authenticated admin visual create/edit/publish/delete, narrow-screen UI and final
artwork, full apartment/media CMS, reset email and backups/restore, real contact
delivery/abuse controls, Smoobu inventory/date/rate/minimum-stay/fee/payment/
confirmation and later navigation behavior under an approved test procedure.

## Historical evidence (not a claim about the current branch)

## Execution record
Pending dependency installation and local execution. Do not interpret written tests as passed tests. Actual command results will be appended.

2026-11-20 foundation verification: 4/4 domain tests passed; TypeScript passed; ESLint passed without warnings; Next.js production build passed. Playwright against local production output: 18/18 passed in 39.8s across desktop/tablet/mobile Chromium (installed Chrome channel). Development-server runs exposed and fixed contact origin and streamed 404 issues; one cold development navigation remained unstable, so CI/browser suite now uses built production output. Smoobu and CMS authentication/publishing remain unverified.

2026-11-20 screenshot-adapted slice: production build including TypeScript passed; ESLint passed without warnings; 4/4 domain tests passed. Final Playwright run against local production build: 24/24 passed in 1.3m, covering desktop/tablet/mobile, capacity/amenity search, mobile navigation, contact validation and error states, 404, approved FAQ fallback, overflow/keyboard skip link and rental-only text across public routes. A select-label naming issue found by the expanded suite was fixed with explicit aria-labelledby. Desktop/tablet/mobile screenshots inspected; final photography/font fidelity remains pending.
