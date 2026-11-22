# Security and UX verification

Review date: 2026-11-22

## Implemented controls

- Payload authentication remains the only administrative authentication system; there is no public guest signup or duplicate guest database.
- Public user creation is denied, user administration is restricted to the administrator role, and editors can manage editorial content only.
- Login attempts are limited to five before a ten-minute lock. Session cookies use `SameSite=Lax` and automatically require HTTPS when `SITE_URL` is HTTPS.
- Startup fails closed when `DATABASE_URL` or `PAYLOAD_SECRET` is missing. `SITE_URL` must be a credential-free HTTP(S) origin.
- Automatic schema push is restricted to local development or explicit CI. Production must use reviewed migrations.
- Uploads are limited to approved raster image types and 10 MB. Media remains private until explicitly published.
- The contact endpoint enforces origin, content type, streamed body size, schema validation and a honeypot. It stores no personal data and fails closed until approved mail delivery and durable rate limiting exist.
- Security headers disable framing, MIME sniffing, unnecessary browser capabilities and DNS prefetch. HSTS is enabled only for an HTTPS production origin.
- Smoobu remains the sole source of booking, availability, prices, fees, payment and confirmation. The website has no independent checkout.
- Dependency audit completed with no known vulnerabilities after pinning patched transitive versions.

## Verification performed

- TypeScript check passed.
- ESLint passed for application, scripts and tests.
- Four domain tests passed.
- Production build passed on Next.js 16.4.6.
- Thirty-six Playwright scenarios passed across desktop, tablet and mobile using installed Chrome.
- All public pages were checked for a single primary heading and horizontal overflow.
- Login, invalid credentials, forgot-password UI, unavailable first-user signup and anonymous user-creation denial were checked.
- Security headers, contact abuse rejection, 404 behavior, rental-only language and absence of unapproved prices were checked.
- Smoobu Booking Engine loaded and returned an honest no-availability result for the tested one-night date range; no reservation or charge was created.

## External blockers and approvals

- Creating the prepared Smoobu test accommodation may affect subscription billing; the UI currently indicates an example charge of EUR 24 for six remaining months on an annual plan. It must not be submitted without explicit approval.
- GitHub collaborator invitation requires an authenticated repository-owner browser session and confirmation at the final permission-changing step.
