# Agent instructions

- Explain progress in Persian. Code, docs and commits in English. Public UI in German.
- Rental-only: short holiday/nightly stays. Never introduce purchase, sale, ownership transfer, investment or marketplace flows.
- Smoobu is the sole source of reservation, availability, nightly pricing, minimum stays, fees, payment and confirmation truth.
- Use supported Booking Engine integration. Do not build independent checkout, collect card data, calculate prices, or synthesize confirmed reservations.
- No custom guest authentication, duplicated guest records or booking admin.
- Inspect actual Figma visuals before implementing final visuals. Preserve source Figma. Do not infer colors/assets from metadata.
- Preserve existing work. Use feature branches, small English commits and checks before push. Never force-push or change main without review.
- Never add secrets to Git or request credentials in chat. No paid services or production deployment without explicit approval.
- Development fixtures must be visibly labeled and excluded from production.
- Publish only approved content/legal text. Never treat unconfirmed EUR 99 rates, cleaning tiers, cancellation percentages or payment methods as policy.
- CMS authentication must use an established implementation and server-side authorization; no mock admin.
- Record actual verification, blockers and assumptions. Mocks do not verify Smoobu.
- No live reservations or charges without an agreed test procedure.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
