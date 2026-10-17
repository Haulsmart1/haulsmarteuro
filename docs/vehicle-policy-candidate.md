# Vehicle owner read candidate — review only

This advances PR #6 with an executable, narrowly scoped candidate and actual synthetic PostgreSQL RLS tests. Nothing has been applied to Supabase. PRs #4, #5 and #6 remain untouched.

The repository has no existing inserts/updates into `live_loads` or `invoices`, nor an invoice recipient mapping or assignment workflow. Searches across main `pages`, `src`, `lib` and API code therefore cannot establish whether `operator_id` means read access or `issued_to` is an authenticated recipient. The obsolete dashboard stores its own local demo login and supplies no database ownership evidence. Do not infer extra load/operator or invoice/recipient permissions from those screens.

`vehicles.user_id` references `users.id` in the previously verified catalog, and the proposed personal workspace already filters on that column. This candidate permits authenticated owner-only vehicle reads, rejects null owners, denies anonymous access, and revokes write/TRUNCATE grants. It does not grant loads, invoices, shared-company access, admin bypass or commercial entitlement. Profiles whose IDs do not map to Auth stay inaccessible; there is no email-based remapping.

The SQL is deliberately outside `supabase/migrations`: the full real schema and production role inheritance have not been reproduced. Its guard refuses missing RLS or any existing vehicle policy, requiring renewed review rather than composing an unknown permissive policy. Before activation, review role inheritance, column grants and external writers; export the actual schema and run equivalent tests in a Supabase test project through its Data API. Generate the approved migration using the Supabase CLI. Do not paste this candidate into production as a workaround.

Run `npm ci --prefix tests/access` then `npm test --prefix tests/access`. These tests use pinned PGlite (embedded PostgreSQL), synthetic rows and non-owner roles. They exercise cross-account/direct-ID denial, null identity, anonymous denial, INSERT/UPDATE/DELETE/TRUNCATE denial, and refusal of preexisting policies. They are database-engine tests, not browser/PostgREST/production acceptance or a full schema compatibility claim.

References: https://supabase.com/docs/guides/database/postgres/row-level-security and PR #6 catalog evidence.
