# Design implementation record

Source: https://www.figma.com/design/ZADovEh3pCMm5h4dZK215D/RF-Sauerland-Immobilien?node-id=2001-1104
Read-only inspection on 2026-11-19; source file unchanged.

23 top-level frames confirmed by actual metadata. Desktop home 2003:3830; mobile home 2003:4477 and 2001:2381; rental list 2001:3464 / 2001:4598; detail 2003:3388 / 2003:2988; about 2002:2029 / 2002:1763; contact 2002:2645 / 2002:1104. Other frames include custom checkout, account and sales listings.

Page-level design-context returned no-selection errors. Metadata worked; subsequent frame-level design-context hit Figma Starter MCP quota. No screenshot, tokens or downloaded design assets available. The current UI is a neutral functional scaffold, not a Figma implementation. Obtain exported desktop/mobile references or restored MCP access before visual implementation. Do not substitute stock photos for actual apartment photos.

## Rental adaptation checklist
- Navigation: apartments/stays/about/contact/FAQ, no sales routes.
- Home: replace buying/selling/renovation copy, investment messaging, sales cards and prices.
- List: capacity/amenities; dates and availability remain provider-owned. Remove purchase-price and sale filters.
- Detail: gallery, sleeping capacity, amenities, arrival, rules and booking entry; remove purchase price, ownership/energy sales claims and broker calls to action.
- About/contact/footer: rewrite brokerage, buying/selling and renovation copy to approved host/rental content.
- Checkout/account frames: reference only; no implementation unless Smoobu capability is verified and approved.
- Desktop/mobile adaptation and visual QA remain pending; don't claim pixel fidelity.

2026-11-20: User supplied 23 PNG design exports at C:\Users\tannaz\Desktop\real state and explicitly authorized these as the Figma fallback. Desktop/mobile home, rental listing, contact, about and detail references inspected. These now supersede the visual-access blocker for layout; source images/fonts/assets are still not independently exported. Screenshots must not be embedded as website UI or treated as actual apartment inventory.

## Screenshot-based adaptation implemented
- Deep forest-green actions/sections, warm off-white surfaces, muted ochre labels, serif headings, wide editorial spacing, white rounded cards.
- Header/footer contain rentals, host information, FAQ, contact and provider booking entry only. No accounts/favorites/sales controls.
- Desktop home preserves hero gradient, overlapping search panel, introduction cards, rental feature, region section, about and contact rhythm. Mobile stacks sections and uses an accessible disclosure menu.
- Search uses capacity/amenities, not sales budgets/property types or unverified date availability.
- Home sales catalogue and owner valuation block replaced with rental preparation/booking guidance. About/contact copy is rewritten; screenshot legal/contact details, service promises and prices are not treated as facts.
- Original font files/token values not supplied; Georgia and Arial are system fallbacks. Image panels explicitly await separate approved source assets. No screenshots are embedded/cropped as UI assets; no source design was overwritten.
