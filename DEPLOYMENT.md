# Deployment and recovery

Production is blocked until approved content/legal text, actual design, CMS/auth testing, mail/spam protection, verified Smoobu configuration, host/cost approval and client acceptance. Nothing has been deployed.

Support CMS migration/bootstrap and environment instructions are in ADMIN_GUIDE.md.
The current preview has no persistent customer database/admin; reset email is disabled.

## Local/staging
Install locked dependencies, configure environment outside Git, run typecheck/lint/unit/build/E2E. Use a private staging hostname with authentication and noindex. Set DEVELOPMENT_FIXTURES=false. Keep robots disallow until launch acceptance; SITE_INDEXABLE alone does not remove the deliberate robots block. Do not expose unfinished legal/contact pages as a live service.

## Planned production topology
Node-compatible Next.js host + Payload + PostgreSQL + durable media. Host/vendor and pricing pending. Confirm supported Node/Next/Payload matrix, HTTPS, trusted proxy/origin behavior, secret management, media limits, database connectivity and operator-owned account recovery before deployment.

## Backup procedure to implement/rehearse
1. Schedule encrypted PostgreSQL backups and media snapshots; record retention, location, owner and restore credentials outside this repository.
2. Before migrations, take a timestamped database dump, media snapshot, deployed commit ID and configuration inventory (without secret values in logs).
3. Restore to an isolated database/media location; apply matching application revision; verify login, published/draft separation, gallery assets, Smoobu mapping and content counts.
4. Record restore time, validation results and recovery objectives agreed with operator. No backup/restore capability is claimed until tested.

## Rollback procedure
Retain prior built release and environment configuration. If a release fails, disable traffic/new writes, assess migration compatibility, switch to prior compatible release and run smoke checks. For incompatible migrations restore the matching pre-migration database and media snapshot, explicitly accounting for intervening content writes. Never roll back Smoobu reservation records from this website. Restore traffic only after operator verification. Document incident and follow-up.
