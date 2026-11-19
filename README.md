# RF Sauerland Immobilien

German holiday-rental website for Winterberg. Local foundation, not production-ready.

## Run

Node 24.22.3 and pnpm are available in this workstation's bundled runtime.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://127.0.0.1:3000. Optional `.env.local`: `DEVELOPMENT_FIXTURES=true` enables clearly labeled examples only in development. Production always excludes fixtures. No real apartments are supplied yet.

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

Neutral structural preview; Figma metadata inspected but visual context blocked by Starter MCP quota. No claim of visual fidelity. Contact validates but returns 503 without delivery. Booking requires a verified provider URL and exact hostname. No custom checkout, accounts, rates, fake confirmation, or admin authentication. CMS is a pending architecture decision. Legal pages are unpublished placeholders. Robots blocks indexing and sitemap is empty.

See TASKS.md for implementation status, TEST_PLAN.md for evidence, and DEPLOYMENT.md for release gates. No production deployment is authorized.
