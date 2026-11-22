# RF Sauerland Immobilien — collaborator report

## Project status

The repository contains a German holiday-rental website for short stays in Winterberg. Purchase, sale, investment and real-estate marketplace flows are outside scope. The current implementation is local/staging only and must remain non-indexed until content, legal text and production operations are approved.

Repository: `tannaz-sh/Vacation-Apartment-Booking-Website`

- `feat/rental-foundation`: tested public-site foundation.
- `feat/local-payload-cms`: Payload CMS, local PostgreSQL, dynamic content, Smoobu Booking Engine link and current active work.
- `main`: do not update directly; use pull requests and review.

## Technology

- TypeScript, Next.js 16 and React 19
- Payload CMS 3 with established administrator authentication
- PostgreSQL for content and administrator records
- HTML/CSS responsive interface based on supplied Figma screenshots
- Playwright, Node test runner, TypeScript and ESLint for validation

## CMS scope

Payload manages apartments, approved media, FAQs, pages, SEO and shared site settings. Pages cover the homepage, apartment listing, booking introduction, FAQ introduction, about, contact, imprint, privacy and booking terms. Shared settings cover brand text, preview notice, navigation, header action, footer, legal links, public contact details and default SEO.

Content uses drafts, authenticated preview and explicit publishing. Anonymous website queries use Payload access control and return published records only. Media is private by default and must be explicitly marked public. Administrators manage users and content; editors manage content but cannot manage user accounts.

## Smoobu boundary

Smoobu remains the source of truth for availability, nightly prices, minimum stays, fees, payments, reservations, cancellations and confirmation. The website links to the supported Smoobu Booking Engine and stores only apartment-ID mappings for marketing content. Do not add local pricing, checkout, card collection, guest accounts or duplicated reservation records.

Verified read-only account configuration:

- Booking Engine: `https://booking.smoobu.com/9A1947006`
- Neuastenberg apartment ID: `3587886`
- Silbach apartment ID: `3587887`

No live reservation, payment, pricing or portal setting was changed during verification.

## Local setup

Use Node.js 24.22.3 and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm db:local
# in a second terminal
pnpm cms:seed
pnpm dev
```

Open `http://127.0.0.1:3000/admin`. Local PostgreSQL binds to `127.0.0.1:54329`; generated credentials, database files and uploaded media remain outside Git. The seed command creates missing page drafts and preserves existing content.

## Verification

The latest local CMS work passed Payload type generation, TypeScript, ESLint, four domain tests and a production Next.js build. Browser coverage checks German navigation, responsive behavior, published-only content, Payload authentication, safe Smoobu linking, contact validation, 404 behavior and absence of purchase/sale messaging.

## Known release blockers

- Approved final German copy, legal text, contact details and licensed photography
- Production host and budget approval
- Managed PostgreSQL backups and a tested restore procedure
- Durable S3-compatible media storage
- Production email delivery, spam protection and administrator recovery
- Staging acceptance and an agreed Smoobu booking test procedure

Do not deploy, enable indexing, create live reservations or incur paid-service costs without separate approval.
