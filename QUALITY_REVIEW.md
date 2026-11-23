# Quality review and release plan

Review date: 2026-11-23. Baseline `f5fa3ba`; branch `review/quality-gate`.
The user authorized pushing this test branch on 2026-11-23, exclusively to
`tannaz-sh/Vacation-Apartment-Booking-Website`, using `pashmak2233`.
No main/default-branch merge, production deployment or real reservation is authorized.

## Scope

The user confirmed the brand RF Sauerland Immobilien and requested an embedded
Smoobu form, a floating topic/Q&A helper, and admin editing by page and section.
The supplied non-secret Smoobu snippet identifies account 1947006. Approved
apartment data, images, legal texts and guest answers are still missing.

Smoobu remains the booking/payment source. This implementation does not add
custom guest accounts, local booking administration or generative AI answers.
The support CMS is not the full planned apartment/media/page CMS.

## Score interpretation

Scores are task-specific: 2 = missing/blocked; 3–5 = partial; 6–7 = meaningful
acceptance gap; 8 = defined task works with relevant checks; 9 = negative and
regression evidence too; 10 = complete acceptance evidence including external
systems where applicable. Below 8 remains open. Do not manufacture passing
scores by repeating mocks or averaging away blockers.

## Current ordered plan and scores

| Task | Score | Evidence / next step |
| --- | --- | --- |
| Requirements, repository review and scope decisions | 9/10 | Instructions inspected; brand and latest embed recorded; dependencies and unfinished work identified |
| Strict contact parsing fixes | 9/10 | Reproduced JSONP acceptance, mixed-case JSON rejection and invalid UTF-8 acceptance; added passing regressions |
| Support topic model and publication/page filtering | 9/10 | Pure tests and real PostgreSQL checks; no draft/private revision or internal-field leakage |
| Floating support panel, desktop interaction | 8/10 | Cloud Browser verified open, heading focus, Escape and focus return, topic selection, answer expansion, page scope and contact navigation; no approved customer answers yet |
| Payload support CMS backend and access control | 9/10 | 37 real DB/HTTP assertions: admin login, CRUD, drafts, versions, public account/write denial, cookie session and CSRF protection |
| Admin form workflow and narrow-screen visual acceptance | 7/10 — open | Authenticated admin pages pass server-render checks; visual editing and full mobile/tablet UI suite still need browser-capable verification |
| Initial real Smoobu embedding | 8/10 | Cloud Browser loaded actual form and searched 23–24 November 2026 for one guest inside `/buchen`; no availability reported, no redirect or booking; provider renders English |
| Complete provider booking/payment/confirmation flow | 6/10 — open | Not submitted; verify account setup, language, results-in-new-tab option and full flow under an agreed test procedure |
| Build and executable regression checks | 9/10 | Locked install, types, lint, 8 domain tests, production build, 37 CMS checks and 21 HTTP executions pass |
| Complete automated browser regression suite | 7/10 — open | CLI Chromium cannot launch under environment socket restrictions; written UI cases are not reported as passing |
| Checkpoint, handover and review records | 9/10 | Current setup guide, limitations, task plan and exact test evidence documented |
| Authorized test-branch push and remote CI | 2/10 — blocked | Push is approved for the tannaz-sh repository only. Both identities now match pashmak2233, but integration writes return 403. The remote test branch exists at the original baseline; feature changes are local. Webeditor origin approval is pending. |

## Verification details

- `pnpm install --frozen-lockfile --ignore-scripts`, `pnpm typecheck`, `pnpm lint`,
  `pnpm test` and `pnpm build` pass. Dependency changes are Payload 3.94.1,
  its PostgreSQL/Next/translations packages and GraphQL. Lockfile is updated.
- `pnpm test`: 8 domain tests pass.
- `TEST_DATABASE_URL=.../support_review_test pnpm test:cms`: 37 assertions pass
  against isolated real PostgreSQL and the built application. Test data is
  synthetic. Tests require localhost and the exact dedicated database name.
- HTTP-only Playwright selection: 21 passes = 7 scenarios across 3 project names.
  These are **not** 21 device/browser UI tests.
- Manual Cloud Browser: initial real Smoobu form, empty support state, keyboard
  focus/close, synthetic published topic tiles, expansion, per-page filtering,
  hidden draft and contact navigation verified. Synthetic records were only in
  the isolated test database, not committed or made into customer policies.
- Admin login page rendered with a configured test database. Login/CRUD/session,
  protected dashboard/list/create/edit page output and anonymous draft/version/
  account denial were verified through actual Payload and HTTP; authenticated admin form editing
  was **not** exercised in the browser. Do not conflate these evidence types.
- A draft-revision regression initially failed because the test tried to read an
  edited draft as public. The test was corrected to explicitly republish and also
  verify the previous published version remains visible; all 37 checks pass.
- Earlier Playwright download failed (HTTP 403); installed Chromium launch failed
  with `socket() failed: Operation not permitted`. No sandbox protection was
  bypassed. Managed Sites preview made manual Cloud Browser checks possible.
- Continuation on 2026-11-23: repository changes survived environment restart.
  A targeted Chromium retry still failed before application assertions with
  socket EPERM. The restored managed preview was verified in Cloud Browser.
- Extended HTTP tests initially assumed all Next redirects use an HTTP 3xx and
  omitted browser Fetch Metadata headers on authenticated navigation. Installed
  Next/Payload source confirmed streamed redirects and intentional cookie CSRF
  checks. Tests now model real browser navigation and assert that denied page
  responses contain no private record text. No access protections were relaxed.
- Cloud Browser searched the real embedded form for 23–24 November 2026, one
  guest. Smoobu returned no available accommodation inside the iframe; the main
  URL stayed on `/buchen`. This is a search check, not checkout acceptance.
- Remote CI is configured with disposable PostgreSQL and full browser tests but
  has not run. Local results do not establish a remote CI result.
- Added a real admin-form lifecycle test for desktop/tablet/mobile: create draft,
  publish, edit answers without leaking drafts, add/remove questions, unpublish
  and delete; guest checks cover page/section scope, long text, focus, FAQ and
  contact navigation. `pnpm test:cms:ui -- --list` verified fixture setup,
  migration, discovery of all 3 device projects and cleanup, not UI execution.
- Types/lint and 8 domain tests passed again; all 37 real CMS assertions passed
  again. The runner still denies AF_UNIX socket creation, preventing Chromium.

## Remaining product work

| Work | Score | Required next step |
| --- | --- | --- |
| Full apartment/media/page CMS | 3/10 | Add collections, mapping, media rights/alt/order, publication and runtime slug handling |
| Real apartment/gallery content and final design | 5/10 | Approved inventory, imagery/assets and reference-based visual acceptance |
| Contact delivery and support escalation | 3/10 | Approved inbox/transport, durable abuse control, privacy and real delivery tests; link exists but sending is still disabled |
| Approved FAQ/legal/operator content | 2/10 | Customer approval and content entry; do not invent prices, cancellation or payment rules |
| Booking email/link/QR/provider guest capabilities | 2/10 | Verify actual supported provider capability and agreed acceptance flow |
| Production CMS setup and account recovery | 3/10 | Host/database/secrets, administrator bootstrap, HTTPS, mail recovery and operator ownership |
| Release/domain/SEO/backup/handover | 2/10 | Host/cost approval, restore rehearsal, client acceptance and separate deployment authorization |

Next: transfer the reviewed commit to the authorized test branch using the
correct GitHub identity, run CI, fix failures and report the evidence. Production
and remaining product work stay outside this test-branch authorization.

**Disposition: requested feature implementation is available for review; the
whole website is not ready for production or contractual acceptance.**
