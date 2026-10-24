# HaulSmart account access: review before activation

Status: review only. No production SQL, data, configuration, grants or policies changed.

This accompanies workspace PR #4 without editing that active branch. It is not an activation migration. Missing ownership rules must be resolved before a migration is generated or applied.

## Verified read-only on 17 October 2026

Project: `tuksbevoylazhstmjpcf` (Haul).

| Table | RLS | SELECT policy | Ownership evidence |
| --- | --- | --- | --- |
| users | enabled | `auth.uid() = id` | 6 profiles; 5 IDs match auth.users |
| drivers | enabled | `operator_id = auth.uid()` | operator_id references users; auth_user_id references auth.users |
| vehicles | enabled | none | nullable user_id references users |
| live_loads | enabled | none | nullable user_id AND operator_id each reference users |
| invoices | enabled | none | issued_by references users; issued_to has no foreign key |

The last three core tables currently contain no rows. An empty account workspace therefore cannot prove either correct isolation or working permissions.

`anon` and `authenticated` have SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER and TRUNCATE table grants on users, vehicles, live_loads and invoices. RLS does not protect TRUNCATE. Separately, users has an INSERT policy with `WITH CHECK (true)` for public. Do not treat profile role/approval fields as trusted authorization claims until profile creation and grants are reviewed.

21 legacy public tables have RLS disabled. They are not used by the proposed workspace; no blanket RLS change is included because that would alter unrelated live behavior. The legacy exposure and existing grants need a separate compatibility review before launch.

## Exact access decisions still needed

1. Loads: is this personal workspace limited to `user_id = auth.uid()`, or should the assigned operator (`operator_id`) also read a load? Are exchange listings a separate intentionally public subset? Default until decided: no new policy.
2. Invoices: does issued_to always identify a Supabase account/profile UUID, or an external customer? Should recipients see drafts, or only issued/paid invoices? Default until decided: no recipient policy.
3. Profiles: what generated the unmatched profile, and which server-controlled path creates profiles? Do not match by email or backfill identities automatically.
4. Vehicles: user_id ownership is structurally clear, but the owner-only read policy still needs an isolated two-account test and grant review before activation.

No administrator bypass, company membership, subscriptions or shared fleet access is inferred from user-editable metadata or email domains.

## Safe migration and acceptance plan

After these semantics are confirmed, generate a dedicated migration with the Supabase CLI. Keep any grant reduction and policy additions explicit and narrowly scoped; verify compatibility first. Do not add a service-role key, SECURITY DEFINER helper or `USING (true)` workaround.

On an isolated database with the actual schema and reviewed migration, seed synthetic accounts A and B, a vehicle owned by each, a load owned by A/assigned to B, an unrelated load C, and invoices with each status. Use the Data API roles, not a postgres/service-role connection, for assertions.

- Signed out: no personal profile, vehicle, load or invoice rows; writes and TRUNCATE denied.
- Account A: own allowed records visible; unrelated B/C records denied, including direct ID lookups without frontend filters.
- Account B: only access explicitly granted by the confirmed assignment/recipient rules; draft-invoice case tested separately.
- Null/orphan owner and spoofed metadata: no additional access.
- INSERT/UPDATE/DELETE: denied for this read-only workspace; test attempted owner reassignment and fabricated profile role/approval.
- Logout and expired session: personal records disappear; no cached prior-account data.

Run actual database isolation tests (`supabase test db`) before calling the policies verified. No such test is claimed here: this checkout has no local schema/migration baseline or local Supabase/Postgres runtime, and production writes are excluded.

## Sources

- Supabase RLS guide: https://supabase.com/docs/guides/database/postgres/row-level-security
- PostgreSQL RLS limitations (TRUNCATE): https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- Read-only catalog queries of pg_policies, information_schema.role_table_grants, foreign-key metadata and aggregate profile/auth matching.

Current Supabase changelog checked: 12 October TLS cipher deprecation affects old clients from 10 November; no relevant policy semantics change was found. This review does not require changes to HTTP/TLS configuration.
