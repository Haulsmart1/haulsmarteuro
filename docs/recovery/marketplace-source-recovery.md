# HaulSmart marketplace source recovery — 17 October 2026

## Verified provenance

The Neon project `hidden-silence-36217670` (haulsmart-marketplace), default development branch `br-broad-shape-b9og909d`, already contains schema version 17. Read-only counts: companies, memberships, jobs, vehicles and Neon Auth users are all zero.

Vercel deployment `dpl_Dv54VvPKTwetFVTRoEXMyFYT286F`, created 13 October 2026 at 10:42:45 UTC, retains uploaded marketplace source. Its source tree includes all migrations 001–017, marketplace services, account pages, operations, auth and tests. Earlier Vercel deployment metadata identifies `stu-development` at `f2cdd16da23c11f62bd1551a04e5a87ca09c0ddf`. GitHub currently returns 404 for that commit and does not list that branch.

The connected repository main and PR #11 use Supabase instead. Vercel's HAULSMART_DATABASE_URL, NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET target preview only. They must not be copied into production or connected to the Supabase release candidate as a shortcut.

## Identity contract recovered from complete short files

- `src/lib/auth/server.js` uses createNeonAuth from @neondatabase/auth/next/server; cookie secret minimum length 32.
- `src/lib/session-access.js` uses a verified Neon session's user.id and rejects missing, expired or banned identities.
- `src/lib/marketplace-db.js` uses a server-only pg Pool configured through HAULSMART_DATABASE_URL.
- The company/membership model has text user IDs. Supabase UUIDs must not be silently substituted for Neon identities.

## Recovery limitation

The connector truncates long source contents after 2000 base64 characters and nested route directory listings at depth. The accompanying manifest contains discovered paths and Vercel file identifiers, not a complete restorable application. Do not deploy the partial scratch recovery.

## Next steps

1. Use the owner's existing authenticated Vercel CLI/API access to export the complete uploaded source tree for the deployment above, including all nested API routes and package lock. Retrieve source files only; exclude environment values.
2. Alternatively recover the original stu-development checkout/commit from a machine or cloud checkout that still retains it.
3. Preserve recovered source on its own recovery branch; run its existing unit tests and build without live database writes.
4. Compare all 17 migrations with the existing schema. Do not rerun migrations, bootstrap accounts or seed fixtures against live databases.
5. Test Neon login and company membership on an isolated environment. Keep current Supabase users/data intact. Explicitly reconcile identity/provider ownership before release.
6. Review email/payment boundary configuration before any production integration. No billing activation is included.

No database, environment, production, email or payment changes were made in this investigation.
