# Architecture

## Website and support CMS

Next.js App Router + TypeScript. Public routes are in the `(website)` route group;
Payload routes are in `(payload)` with a separate root layout so CMS styles do not
alter public pages. URL paths are unchanged. Payload 3.94.1 is integrated with
Next 16.4.6 and PostgreSQL. Node 24.22.3 is the supported project runtime.

Only `admins` and `support-topics` are implemented. Marketing apartment content
still uses the existing adapter; media/apartment/page/SEO CMS collections remain
planned. No custom guest database or reservation administration is introduced.

All writes and version-history reads require an authenticated Payload admin.
Anonymous reads are restricted to published documents; frontend additionally
projects validated public fields. Drafts and internal metadata are not sent to
visitors. First-register is blocked in both the HTTP boundary and a create hook;
the first admin is created by the environment-driven bootstrap script.

Public support content is fetched per request with `connection()` and React's
request cache. No persistent content cache is used. An already-open page needs a
refresh to see edits. Client navigation resets the panel and filters topics for
the current pathname. Global FAQs include all published questions. No generated
answers, raw HTML rendering or section-based scroll tracking is implemented.

PostgreSQL schema auto-push is disabled. Committed migrations create auth,
support topic/question and version tables. No live database was provisioned.
CMS routes fail closed unless a database and persistent secret are configured.
Email is explicitly disabled until a real transport is configured; no reset
credentials are printed by a development email adapter.

## Booking

The exact non-secret account-provided endpoint is
`https://login.smoobu.com/de/booking-tool/iframe/1947006`. Optional
`SMOOBU_EMBED_URL` overrides must match the official HTTPS origin and embed path;
credentials, arbitrary hosts, queries and fragments are rejected.

The official `BookingToolIframe.js` initializes the form after the guest clicks
its load button. It obtains widget data and inserts Smoobu's actual booking
iframe. The JSON-returning initialization endpoint is not an iframe document.
No navigation to Smoobu is added by our page. Payment-provider redirects and
later provider-controlled steps require separate acceptance testing.

Smoobu owns inventory, availability, rates, fees, booking, payment and confirmation.
No local rates, confirmation synthesis, API secret or custom checkout exists.
Per-apartment mapping and actual checkout/confirmation verification remain open.

## Contact and operations

Bounded request body, exact same-origin check, Zod validation, strict JSON media
type and UTF-8 parsing, and honeypot exist. Delivery fails closed. Add durable
abuse control, approved SMTP/inbox, retention and verified delivery before enabling.
`SITE_URL` is explicit; public origin is not inferred from forwarded headers.

Hosting must support Node and PostgreSQL. Provider, costs, durable media, backups,
recovery and production approval are still pending. See DEPLOYMENT.md. Current
apartment slugs remain build-enumerated until their CMS feature is implemented.

## References checked during implementation

- https://payloadcms.com/docs/getting-started/installation
- https://support.smoobu.com/hc/de/articles/360010836700-Wie-baue-ich-das-Buchungssystem-in-meine-Webseite-ein
- Installed Next.js documentation for route groups, dynamic rendering, scripts and routes.
