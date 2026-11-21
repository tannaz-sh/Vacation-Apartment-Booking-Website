# Architecture

## Implemented foundation
Next.js App Router + TypeScript + Tailwind. Server-only content adapter isolates future CMS; pure validation/filter/FAQ/booking URL functions are independently testable. No database or microservice yet. Dependencies resolve into a lockfile; no globally installed package manager required on this workstation.

## Approved direction; hosting pending
Payload CMS integrated with Next.js, PostgreSQL and a Node-capable host with durable media storage. Payload provides established authentication and a content admin rather than custom auth. Its documented Node and Next compatibility must match the final installed version before integration. PostgreSQL provides a migration/backup path but adds operational cost. Host selection must include runtime, database backups, storage, SMTP, region/privacy and maintenance ownership. No service has been purchased.

Alternatives: Git-backed CMS reduces database operations but imposes repository authentication/editor workflow constraints; externally hosted CMS introduces vendor quotas and potential recurring fees. Final choice needs client approval and hosting constraints.

## Booking
Use the exact supported Smoobu hosted Booking Engine URL initially. Link-out avoids loading third-party scripts on page view. Exact hostname allowlist and HTTPS validation; no invented query parameters. Select dates/guests inside provider. Later per-apartment links must come from account configuration, with verified ID mapping. Never implement local pricing or confirmation interpretation.

## Contact
Bounded request body, same-origin check, Zod validation and honeypot exist. Delivery intentionally fails closed. Add trusted-proxy-aware durable rate limiting, SMTP transport, retention policy and end-to-end delivery verification before enabling.

## Sources checked 2026-11-19
- https://nextjs.org/docs/app/getting-started/installation
- https://payloadcms.com/docs/getting-started/installation
- https://support.smoobu.com/hc/en-us/articles/360010836700-Add-the-Booking-Engine-to-your-website

## Subsequent approval
User approved Payload + PostgreSQL direction on 2026-11-19; hosting/vendor/cost approval remains separate. The local CMS runtime uses localhost-only PostgreSQL with ignored persistent data and credentials. Production will require committed migrations, managed backups and durable object storage before deployment.

Contact origin is compared against explicit SITE_URL (exact origin without trailing slash). Development defaults to http://127.0.0.1:3000; production requires configuration. Do not infer public origin from untrusted forwarded headers. Current apartment slugs are build-enumerated; CMS publishing must add authenticated invalidation and runtime slug handling before content publishing can be enabled.
