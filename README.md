# RF Sauerland Immobilien

German holiday-rental website for Winterberg. Local foundation, not production-ready.

## Run

Node 24.22.3 and pnpm are available in this workstation's bundled runtime.

```sh
pnpm install --frozen-lockfile
pnpm db:local
# In a second terminal:
pnpm dev
```

Open http://127.0.0.1:3000 and create the first administrator at http://127.0.0.1:3000/admin. The local database command creates ignored random credentials, binds PostgreSQL to localhost only, and persists data in `.local/postgres`. Optional `.env.local`: `DEVELOPMENT_FIXTURES=true` enables clearly labeled examples only in development. Production always excludes fixtures.

After the first administrator exists, run `pnpm cms:seed` to create any missing page entries as drafts. Manage shared navigation, footer, contact details and default SEO under `Site settings`; manage page-specific copy and sections under `Pages`.

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

On this Windows machine, invoke pnpm through Node if it is absent from PATH:
`node C:\Users\tannaz\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\pnpm\bin\pnpm.cjs <command>`

## Current boundaries

Rental-adapted visual direction based on user-supplied desktop/mobile PNG exports. Figma MCP remains quota-blocked; source photo/font assets are still missing, so image slots are explicitly pending. Payload provides authenticated local administration for published/draft pages, apartments, FAQs and approved media. Contact validates but returns 503 without delivery. The verified Smoobu Booking Engine link is used; prices, availability, fees, payments and confirmations remain in Smoobu. No custom checkout or guest accounts. Legal pages remain unpublished until approved content is entered. Robots blocks indexing and sitemap is empty.

See TASKS.md for implementation status, TEST_PLAN.md for evidence, and DEPLOYMENT.md for release gates. No production deployment is authorized.

## Verification of this slice
Production build, TypeScript and lint pass. Four domain tests and 24 Playwright checks pass across desktop/tablet/mobile Chromium. See TEST_PLAN.md for limitations. Local browser checks used PLAYWRIGHT_CHANNEL=chrome; CI installs Chromium.

## Git delivery
The tested foundation is on `feat/rental-foundation`; local CMS work is developed on `feat/local-payload-cms`. No changes are pushed directly to main.
