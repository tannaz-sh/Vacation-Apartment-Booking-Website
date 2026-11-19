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
