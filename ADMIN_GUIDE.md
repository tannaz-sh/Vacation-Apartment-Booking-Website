# Administrator guide

## Implemented: support content

The website now includes Payload administration at `/admin` for support topics
and administrator accounts. This is **not** an apartment/media CMS or a booking
administration system. Reservations and payments remain in Smoobu.

The preview disables administration until PostgreSQL and a persistent
`PAYLOAD_SECRET` (at least 32 characters) are configured. No customer administrator
account has been created. Do not send credentials in chat or commit them.

### First setup (developer/operator)

1. Provision an approved PostgreSQL database and configure `DATABASE_URL`,
   `PAYLOAD_SECRET` and the exact public `SITE_URL` through the host's secret store.
   HTTPS is required for production; the admin cookie is secure on HTTPS origins.
2. Back up an existing database before migrations. Run `pnpm cms:migrate`.
   Schema auto-push is disabled; committed migrations are the source of truth.
3. Temporarily supply `BOOTSTRAP_ADMIN_EMAIL` and a strong
   `BOOTSTRAP_ADMIN_PASSWORD` (at least 14 characters), then run
   `pnpm cms:bootstrap`. This refuses to run when any administrator exists.
   Remove these two bootstrap variables afterwards.
4. Sign in at `/admin`. Public registration is disabled. Further administrators
   can only be created by an authenticated administrator. All administrators have
   equal content/account permissions; no editor role is implemented.
5. Configure and verify email transport and recovery before production handover.
   Password-reset delivery is deliberately unavailable until then; it must not
   log reset secrets or pretend to send mail. Agree a secure recovery procedure.

### Editing support answers

Open **Support-Themen** and create a topic. Set the title, page, optional page
section and display order. Add one or more questions and answers. Save as a draft
while reviewing. Only publish customer-approved answers. Published questions also
appear in the main FAQ search. The floating panel shows general topics plus
those assigned to the current page; apartment-detail scope covers all detail pages.

The page section is a descriptive label, such as Ausstattung or Anreise. It does
not track scroll position. Answers are plain text; HTML is not executed. You can
edit questions, remove individual questions, unpublish a topic or delete it.
Payload retains up to 20 document versions; version history is admin-only.
Refresh the public website after publishing changes; already-open visitors do
not receive a live content update. A navigation resets the open help panel.

No answers have been approved yet. Empty and unavailable states link to the
contact page. Contact delivery itself still needs an approved inbox and transport.
This is a curated FAQ helper, not generative AI and not a live chat inbox.

## Smoobu

The provided Booking Engine snippet for account `1947006` is integrated using
Smoobu's official initializer. The guest explicitly loads the third-party form;
normal form display stays within `/buchen`. The `/de/booking-tool/iframe/...`
endpoint returns widget data and must not be used directly as an iframe source.

Configure apartment inventory, language, currency, dates, rates, minimum stays,
fees, cancellations, payment methods and confirmation messages inside Smoobu.
Disable Smoobu's option to open results in a new tab if applicable. In the observed
preview the real form loaded in English. A search for 23–24 November 2026 and
one guest returned no available accommodation without leaving the website.
No booking or payment was submitted.
Verify later booking steps and payment-provider handoffs under an agreed test
procedure; initial embedded rendering does not prove the entire checkout flow.

## Still planned

Apartment/gallery/page/SEO editing, real photography, legal text, approved guest
answers, mail delivery, backups and restore rehearsal remain separate open tasks.
Do not publish placeholders as a finished customer service.
