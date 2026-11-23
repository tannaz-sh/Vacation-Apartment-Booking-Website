# Actionable backlog

## Current quality gate (2026-11-23)

Latest source of truth: [QUALITY_REVIEW.md](QUALITY_REVIEW.md),
[TEST_PLAN.md](TEST_PLAN.md) and [WORK_LOG.md](WORK_LOG.md). Older milestones below
are historical; do not read them as current acceptance or a new delivery promise.

- [x] Embed supplied Smoobu account form in the website with official initializer.
- [x] Verify actual initial provider form loads in Cloud Browser without redirect.
- [x] Add floating support topic/Q&A panel scoped by page and section label.
- [x] Add Payload support/admin collections, draft/publish and protected bootstrap.
- [x] Verify real PostgreSQL and HTTP auth/CRUD/draft/write/CSRF restrictions (37 checks), including protected admin page output.
- [x] Verify desktop support interactions with labeled isolated test records.
- [x] Update setup/configuration/CI and preserve previous contact fixes.
- [ ] Complete authenticated admin visual editing and full responsive browser suite.
- [ ] Configure persistent hosting/database/customer admin and recovery transport.
- [ ] Obtain approved content, finish broader CMS/mail features and provider acceptance.
- [x] User approved test-branch push to tannaz-sh/Vacation-Apartment-Booking-Website only (2026-11-23).
- [ ] Authenticate the write-capable connection as pashmak2233 and run remote CI.

## Foundation slice
- [x] Inspect empty workspace and remote; clone; create feature branch.
- [x] Create handoff docs and rental-only agent rules.
- [x] Next.js/TypeScript/Tailwind routes and German rental-only preview; visual direction adapted from supplied screenshots.
- [x] Marketing content adapter, explicitly labeled development fixtures, capacity/amenity filters.
- [x] Initial unavailable/link boundary, now replaced by embedded Smoobu form.
- [x] Contact client/server validation and fail-closed delivery endpoint.
- [x] Approved-answer-only FAQ search with unknown-answer fallback.
- [x] Error/404/loading/empty states and noindex defaults.
- [x] Foundation typecheck/lint/unit/build and 18 browser checks passed; visual-slice verification follows.
- [ ] Commit and push feature branch where write access permits.

## Next: design and CMS (days 1–6)
- [x] Obtain and inspect user-supplied desktop/mobile screenshots; implement rental-adapted visual direction.
- [ ] Obtain separate approved photo/font assets; replace clearly marked image slots and verify final fidelity.
- [x] Architecture direction approved: Payload + PostgreSQL + Node host; no service purchases.
- [ ] Select/approve host and operational budget; verify Payload/runtime compatibility.
- [ ] Add Payload collections: users, media, apartments, pages, FAQs; versions/drafts and SEO fields.
- [x] Implement server-side access for support/admin collections; other CMS collections remain planned.
- [ ] Configure private preview URLs/session, publish invalidation, migrations and backups.
- [x] Test support anonymous draft/write denial and admin CRUD/publishing with isolated PostgreSQL.
- [ ] Rehearse database restoration.
- [ ] CI checks and approved private staging.

## Public pages/content (days 7–13 and 19–22)
- [ ] Client inventory/count, real photos/rights, galleries, alt/order/featured, amenities/capacity/arrival/rules.
- [ ] Rental-only rewrite of all sales copy, including home/about/contact/footer/detail/filter modules.
- [ ] Approved FAQ, host bio, operator contact/legal text; no invented policies.
- [ ] Verified inbox/mail transport, durable rate limiter and privacy/retention policy; actual delivery tests.
- [ ] Per-route approved SEO/canonicals; sitemap published records only; enable indexing only at launch acceptance.

## Smoobu (days 14–18)
- [x] Receive official non-secret Booking Engine embed for account 1947006.
- [ ] Verify operator account setup and apartment mapping.
- [ ] Verify dates, capacity, minimum stays, mandatory fees/taxes, seasonal rates and cancellation settings.
- [ ] Ask provider about cleaning tiers; no local workaround.
- [ ] Verify payment handoff and genuine confirmation via agreed test facility; no unauthorized live booking.
- [ ] Determine supported guest overview capability; otherwise omit.

## QA and delivery (days 23–30)
- [ ] Mobile/tablet/desktop visual/accessibility audit against actual design.
- [ ] Provider outage, failed payment and confirmation test procedure/results.
- [ ] Client acceptance; approved corrections; backups/restore/rollback rehearsal.
- [ ] Separate production deployment authorization, DNS/HTTPS/monitoring verification and admin handover.
- [ ] Begin agreed 30-calendar-day technical support after delivery.

Target is 30 working days, dependent on access, content and approvals. No schedule completion claims.

Final current-slice checks: lint, TypeScript, production build, 4 domain tests and 24 browser tests passed. Local production preview: http://127.0.0.1:3000. Historical result only: current support CMS and initial Smoobu verification are documented above. Actual mail delivery remains unimplemented.

- [x] Local commits saved on feat/rental-foundation; working tree verified clean before delivery notes.
- [ ] Push blocked by missing CLI GitHub authentication; connector has no push permission. CI workflow is written but has not run remotely.
