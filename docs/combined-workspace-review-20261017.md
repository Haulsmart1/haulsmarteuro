# HaulSmart combined workspace review — 17 October 2026

This candidate combines dashboard PR #4 (`881564225f6ebfdce4504168ce909a1c4f7e5eb1`), deployment-local email return PR #5 (`270fb80c9f1a0d8450f7275b9b62107e43e1a42c`) and sign-out recovery PR #7 (`d8ed4fd0499ac8fea9adba84618f1693d7e81266`). The source branches are unchanged. This is a review candidate, not a commercial launch.

## Verified locally

- Seven Node regression tests pass: account identity requirement, bounded owner filters, query-error isolation, failed sign-out recovery and safe deployment-local return URLs.
- Next.js production build passes, including `/login`, `/register` and `/portal`.
- Portal identity is verified with `auth.getUser()` before data requests; sensitive queries remain owner filtered and subject to RLS.
- This Pages Router application uses browser Supabase session detection (`detectSessionInUrl: true`) on `/login`. It does not have a server `/auth/callback` route. Do not copy the CryptoNinja callback fix into this application without changing and testing the complete flow.

## Hosted acceptance gates

1. Use the Haulsmart Vercel team, project `prj_QH1DXtSPKCPYLlinJoUiF5mURCIY`. Project inspection confirms previews require Vercel authentication. Protection is independent of the product's login.
2. In the correct HaulSmart Supabase project's allowed redirect URLs, explicitly approve the candidate's exact `https://<preview-host>/login` (and test any trailing-slash canonicalisation). Keep the production Site URL unchanged. No redirect configuration was changed here.
3. Request one fresh email link on the approved candidate. Open it in the same browser, verify arrival at `/portal`, refresh persistence, each workspace tab and sign-out. No test email or identity was created during this review.
4. Resolve the account-data release blocker documented in PR #6: core loads, vehicles and invoices currently lack SELECT policies. An empty response is not proof that data access works. Ownership decisions and two-account allow/deny tests must pass before policy activation. No production SQL was applied.
5. Verify phone widths and long account/route strings on the combined candidate. Dashboard functionality is read-only; load posting, quotes, subscriptions and online payments remain unavailable.

No production configuration, data, billing or email changed. The successful build does not establish hosted login or data isolation acceptance.
