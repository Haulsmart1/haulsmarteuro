# HaulSmart account workspace acceptance

This change is a read-only workspace, not a commercial launch or freight marketplace activation. It adds navigation, account-scoped load search, fleet, invoices, profile and explicit disabled payment messaging. It never writes records or takes payment.

## Database release blocker

Read-only policy inspection on 16 October 2026 confirmed SELECT-own on public.users only; live_loads, vehicles and invoices have no policies. An authenticated Data API request may therefore return zero rows despite existing records. The interface explicitly explains that empty results may reflect permissions. Counts mean visible records, not totals.

Before release, confirm the ownership model with the operator and prepare a reviewed migration using the Supabase CLI. Suggested SELECT scopes for this personal workspace are users.id = auth.uid(), live_loads.user_id = auth.uid(), vehicles.user_id = auth.uid(), and invoices.issued_by OR issued_to = auth.uid(). These scopes intentionally exclude an exchange-wide board and operator-assignment sharing. Do not add broad authenticated-only policies. No SQL was applied by this change. Test anonymous denial, own-row visibility and cross-account denial with two isolated test users before approval. Legacy tables with disabled RLS are not used by this workspace.

## Acceptance checks still required

- Sign in on the preview, refresh, and confirm the same account remains visible.
- Sign out and confirm records disappear and /login opens.
- With approved test policies, verify loads/fleet/invoices are correctly isolated between users.
- Verify empty records, network failure and denied access; no sample records should appear.
- Verify search, keyboard navigation and 320/390/768px widths, including long company/email/route text.
- Confirm posting, quoting, online payments and subscription activation remain unavailable.

Local automated verification: node --test lib/portalData.test.js and npm run build. Browser acceptance and production SQL activation are deliberately separate from these checks.
