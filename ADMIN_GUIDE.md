# Administrator guide (planned workflow)

The CMS is not enabled yet; there is no production admin login to use. Architecture direction approved: Payload + PostgreSQL. Do not share passwords/API secrets in chat.

Website CMS will manage apartment marketing details, Smoobu ID mapping, photos/alt/order/featured, homepage/about/contact, approved FAQs, SEO titles/descriptions/slugs, drafts and publish. Established CMS authentication will be used. Main admin first; no editor until needed.

Before publishing an apartment, verify the provider ID, occupancy, amenities, photo rights and alt text, arrival/departure and stay rules. Preview at desktop/mobile sizes; publish only approved content. Never paste rates or calculate fees locally. Use Smoobu for reservations, rates, availability, minimum stays, fees, payments and cancellation operations.

Before enabling booking, copy the actual account's Booking Engine Preview URL and verify it with the developer through a non-secret channel. Configure supported payment methods and policies in Smoobu. Test only under an agreed procedure. Bank-transfer receipt remains operator-verified where applicable.

FAQ assistant exposes only approved answers. Unknown questions must not generate policy. Legal changes require approved replacement text. Contact delivery/retention configuration and administrator recovery/backup procedures must be completed before handover.
