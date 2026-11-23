# Current work checkpoint

Updated for the user's Smoobu snippet and support feature request (continued 2026-11-23).
Repo baseline f5fa3ba, branch review/quality-gate. Feature checkpoint: 4c81e94.
The user authorized push and CI on 2026-11-23, exclusively to
tannaz-sh/Vacation-Apartment-Booking-Website as pashmak2233. Never push this
project to a Thirtyfold repository. No default-branch merge or deployment.
Connector and Cloud Browser now verify pashmak2233; repository metadata confirms
push rights. However create_tree and create_blob both return 403 "Resource not
accessible by integration". The only app installation reported is on pashmak2233,
not tannaz-sh. CLI has no authentication. The feature commit is not uploaded.

The authorized remote review/quality-gate branch was created through GitHub UI
and verified with ls-remote at baseline f5fa3ba. No source changes were sent.
The user explicitly approved github.dev/vscode.dev. The correct-branch editor
now loads at vscode.dev/github/tannaz-sh/Vacation-Apartment-Booking-Website/tree/review/quality-gate.
It displays: "The extension GitHub Repositories wants to sign in using GitHub."
Automatic approval review blocked clicking Allow because OAuth permissions are
not yet established. A manual authentication handoff is required for the user
to inspect those permissions. No feature files have been uploaded. Do not
extract browser credentials or bypass this authorization check.

## Implemented

- Preserve existing contact parser fixes and regression coverage.
- Public route group separated from Payload layout/styles, URLs unchanged.
- Payload/PostgreSQL admins and support topics with drafts/versions, published
  public reads, admin-only writes, blocked first-register and CLI bootstrap.
- Floating help icon/panel, topic tiles, question expansion, page/section labels,
  keyboard handling, honest empty/unavailable states and contact link.
- Shared published support content on FAQ page. No invented customer policies.
- Official Smoobu BookingToolIframe initializer using supplied account 1947006;
  guest-initiated loading, fallback state, no own-site provider link-out.
- Types, initial migration, setup docs, test/CI updates and configuration example.

## Evidence

See QUALITY_REVIEW.md and TEST_PLAN.md. Types/lint/build, 8 domain cases,
37 real PostgreSQL/HTTP CMS assertions and 21 HTTP scenario executions pass.
Cloud Browser observed the actual Smoobu form and a no-availability search result
in place (23–24 November 2026, one guest; English provider UI), plus
support panel/topic/answer/navigation/keyboard behavior. Temporary support test
records never represent approved customer content.

## Latest continuation

- Verified all uncommitted files survived the environment restart.
- Added and passed 12 more CMS checks (37 total), including protected admin page
  output and anonymous account/version/draft access. Streamed redirect assertions
  and Fetch Metadata headers model documented Next/Payload browser behavior.
- Retried one CLI UI test; Chromium remains blocked by socket EPERM before tests.
- Restored the managed preview at http://127.0.0.1:4173/ and left the live booking
  page open for review. The normal preview is database-unconfigured, so support
  has an honest empty state and no customer admin login has been provisioned.
- Temporary UI test records and synthetic admin were removed in the prior cleanup.
  No live reservations, secrets in Git, commits or pushes were created.

## Outstanding

- Full CLI UI suite cannot launch Chromium in this environment (socket EPERM).
  Do not bypass protections or report unwritten/unrun results as passed.
- Admin form editing after login and narrow-screen UI acceptance remain open.
  Backend login/CRUD/authorization is tested, not equivalent to complete UI QA.
- The new tests/cms-ui suite covers actual admin form mutations and guest
  visibility for desktop/tablet/mobile. Isolated fixture setup, migration,
  three-project test discovery and cleanup pass. CI execution remains required.
- Real deployment database/admin credentials and reset email are not configured.
- Smoobu full booking/search/payment/confirmation acceptance, language and
  results-in-new-tab settings need agreed verification; no transaction performed.
- Full apartment/media CMS, approved content/legal/assets, mail delivery,
  backups/restore, hosting and client acceptance remain unfinished.
- The supported preview adapter under ignored `.local/cloud-preview` runs the
  built Next app. Never include its temporary local database/test setup in Git.

## Continuation

Resume from this checkpoint, inspect git status and current test evidence, and
preserve all local changes. Use the existing push authorization once correct
authentication is available; do not request the same approval again.
No automatic quota-reset continuation is
scheduled: available automations expose no reliable quota reset event/time.
Never promise autonomous continuation that is not configured.
