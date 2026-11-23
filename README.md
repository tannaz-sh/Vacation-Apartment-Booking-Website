# RF Sauerland Immobilien

German holiday-rental website for Winterberg. Work in progress; not production-ready.

## Run

Use Node 24.22.3 and pnpm 11.25.0. Dependencies are locked.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://127.0.0.1:3000. Use `.env.example` as the configuration reference.
`DEVELOPMENT_FIXTURES=true` enables labeled apartment examples only in development;
production excludes them. Approved apartment content has not been supplied.

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
# Dedicated local test database only; never point this at customer data.
TEST_DATABASE_URL=postgresql://USER:PASSWORD@127.0.0.1:5432/support_review_test pnpm test:cms
pnpm exec playwright install chromium
pnpm test:e2e
```

The CMS test runs real migrations, auth/access checks and HTTP boundary checks
against the built application. It requires the exact isolated database name
`support_review_test` on localhost. CI provisions a disposable PostgreSQL service.

## Implemented in the current review

- Account-provided Smoobu Booking Engine embedded on `/buchen`, loaded on guest
  request with honest loading/failure states. No independent checkout or pricing.
- Floating support panel: page-specific topics, section labels, expandable Q&As,
  keyboard close/focus return and link to contact.
- Payload + PostgreSQL admin for support topics with draft/publish/version control,
  server-side authorization and protected first-admin bootstrap. Public visitors
  cannot register administrators, write content or read drafts.
- Contact input validation and parser regression fixes; sending remains disabled.

See ADMIN_GUIDE.md for setup and scope, QUALITY_REVIEW.md for scores and current
verification, and DEPLOYMENT.md for release gates. Full apartment/media/page CMS,
customer content/legal text, contact transport and booking/payment acceptance are
unfinished. No real reservation or charge was initiated.

## Verification and delivery

Typecheck, lint, domain tests, production build and isolated PostgreSQL checks
were executed locally; the exact latest counts are in TEST_PLAN.md. The Cloud
Browser verified the real initial Smoobu form and support interactions. CLI browser
launch is blocked by the environment; the full automated UI suite is not claimed
as passing. Remote CI has not run.

The user approved pushing `review/quality-gate` exclusively to
`tannaz-sh/Vacation-Apartment-Booking-Website` as `pashmak2233` to run remote CI.
The reviewed changes are committed locally. The remote test branch exists at the
original baseline; integration writes currently return 403 despite the correct
user identity. No merge or production deployment is authorized.
