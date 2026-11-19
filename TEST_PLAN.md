# Test plan and evidence

## Automated scope
Domain tests: publication filtering, capacity/amenities, exact HTTPS provider host validation, credentials/unsafe URL rejection, contact validation/honeypot, approved-only FAQ search. E2E: German navigation, booking unavailable/no confirmation, unknown FAQ, API validation/origin/size/unavailable behavior, 404/admin closed, responsive overflow and skip navigation. Mock data is not provider verification.

## Release-required tests not yet possible
CMS anonymous/draft/mutation authorization, admin login/publishing/preview, restore rehearsal; real galleries/layout against Figma; actual mail delivery and durable rate limiting; Smoobu dates/capacity/minimum stay/fees/taxes/payment/confirmation/provider outage. These need implementation/configuration/access and an approved provider test procedure.

## Execution record
Pending dependency installation and local execution. Do not interpret written tests as passed tests. Actual command results will be appended.
