# Administrator guide

The local Payload CMS is available at `http://127.0.0.1:3000/admin` after running `pnpm db:local` and `pnpm dev` in separate terminals. The first visit creates the initial administrator. Use a unique password and never commit or share it in chat. There is no production admin yet.

The CMS manages apartment marketing details, Smoobu ID mapping, photos/alt/visibility/order/featured, homepage/about/contact/legal pages, approved FAQs, SEO titles/descriptions/slugs, drafts and publishing. Public queries enforce Payload access control and return published content only. Draft preview requires an authenticated administrator.

`Site settings` manages the business name, location line, preview notice, main navigation, header action, footer columns, legal links, public contact details and default SEO. `Pages` contains editable entries for the homepage, apartment listing, booking introduction, FAQ introduction, about, contact, imprint, privacy and booking terms. Page sections support text, cards, image/text and call-to-action layouts. Functional form labels, validation, authentication and Smoobu reservation truth remain application-controlled.

Administrators can manage users and all content. Editors can manage content but cannot list, create, change or delete administrator accounts. New users created by an administrator default to Editor. Run `pnpm cms:seed` once to create missing starter pages as drafts; it preserves existing pages and never publishes legal content.

Before publishing an apartment, verify the provider ID, occupancy, amenities, photo rights and alt text, arrival/departure and stay rules. Preview at desktop/mobile sizes; publish only approved content. Never paste rates or calculate fees locally. Use Smoobu for reservations, rates, availability, minimum stays, fees, payments and cancellation operations.

The account's supported Booking Engine URL and two apartment IDs were verified read-only on 2026-11-21. Configure prices, availability, supported payment methods and policies only in Smoobu. Test live booking only under an agreed procedure. Bank-transfer receipt remains operator-verified where applicable.

FAQ assistant exposes only approved answers. Unknown questions must not generate policy. Legal changes require approved replacement text. Contact delivery/retention configuration and administrator recovery/backup procedures must be completed before handover.
