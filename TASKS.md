# Actionable backlog

## Foundation slice
- [x] Inspect empty workspace and remote; clone; create feature branch.
- [x] Create handoff docs and rental-only agent rules.
- [x] Next.js/TypeScript/Tailwind routes and German rental-only preview; visual direction adapted from supplied screenshots.
- [x] Marketing content adapter, explicitly labeled development fixtures, capacity/amenity filters.
- [x] Booking unavailable state and validated provider-link boundary.
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
- [ ] Implement server-side access: public published content only; authenticated admin writes; protect first-user bootstrap; editor only if requested.
- [ ] Configure private preview URLs/session, publish invalidation, migrations and backups.
- [ ] Test anonymous draft denial, write denial, admin publishing and restoration with isolated test database.
- [ ] CI checks and approved private staging.

## Public pages/content (days 7–13 and 19–22)
- [ ] Client inventory/count, real photos/rights, galleries, alt/order/featured, amenities/capacity/arrival/rules.
- [ ] Rental-only rewrite of all sales copy, including home/about/contact/footer/detail/filter modules.
- [ ] Approved FAQ, host bio, operator contact/legal text; no invented policies.
- [ ] Verified inbox/mail transport, durable rate limiter and privacy/retention policy; actual delivery tests.
- [ ] Per-route approved SEO/canonicals; sitemap published records only; enable indexing only at launch acceptance.

## Smoobu (days 14–18)
- [ ] Operator configures account; supply non-secret Booking Engine links and apartment mapping.
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

Final current-slice checks: lint, TypeScript, production build, 4 domain tests and 24 browser tests passed. Local production preview: http://127.0.0.1:3000. No CMS, actual mail delivery or real Smoobu verification is claimed.

- [x] Local commits saved on feat/rental-foundation; working tree verified clean before delivery notes.
- [ ] Push blocked by missing CLI GitHub authentication; connector has no push permission. CI workflow is written but has not run remotely.
