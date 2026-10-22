# HaulSmart release review — 18 October 2026

Status: **draft / blocked for hosted acceptance**, not approved for merge or production.

This main-targeted candidate consolidates the existing frontend stack without modifying its runtime behavior. The runtime, dependencies and tests are identical to PR #21 at `4f2d3b7a373b67029f8403a4ee0dfc14be387bfc` (source tree `a9757b488e5a66b91311b79ee4e93496600fdeb1`). Only review documentation differs. No active source PR or branch is edited or closed.

## Source and dependency map

| Open draft | Disposition in this candidate |
| --- | --- |
| #4, #5, #7, #8, #9, #11 | Included through the read-only workspace/account candidate; no second merge is needed. |
| #13, #14, #15 | Included: closed paid-AI route and account-change privacy boundary. |
| #16, #17, #18, #19 | Included: startup/configuration errors, registration intent and expired-link handling. |
| #20, #21 | Included: bounded record reads and visible identity-check timeout. |
| #6 | Separate policy investigation; not an activation migration. |
| #10 | Excluded: unapplied review-only vehicle policy requires separate approval and hosted isolation acceptance. |
| #12 | Separate incomplete original-Neon-source recovery manifest; not restored marketplace source. |
| #1 | Separate historical automated dependency proposal. This candidate does not change main's package or lockfile versions and makes no new security-advisory acceptance claim. |

Review this candidate once against main `219665c7eafd56059124f968c17ded5d5d768d21`. Do not merge each earlier overlapping candidate afterwards. Retain originals until a human-approved release and supersession decision.

## Reproducible local checks

From a complete source checkout, with no production secrets:

```sh
npm ci --ignore-scripts --legacy-peer-deps --no-audit --no-fund
node --test lib/*.test.js tests/*.test.js
npm run build
git diff --check -- . ':!node_modules' ':!.next'
```

Tests use synthetic Auth/storage/HTTP inputs; a passing build does not prove an email was sent, login persisted, data isolation works, or any commercial feature exists. This JavaScript checkout has no tsconfig.json; standalone `tsc --noEmit` prints usage and is not a passing validation gate. Next's build checks remain the relevant build validation. The PR records results for the exact published tree. The legacy repository tracks some dependency files; installation can modify those local paths. Do not stage or publish installed dependencies or build outputs. The candidate retains every inherited dependency blob unchanged.

## Hosted acceptance gates — still open

1. **Source/identity decision:** this is the current Supabase read-only account portal, not the original Neon marketplace. A complete original source export/checkout and explicit provider identity reconciliation are needed before claiming freight-exchange restoration. Do not substitute Supabase UUIDs for Neon identities or reconstruct omitted source.
2. **Least-privilege data access:** approve actual load/operator and invoice issuer/recipient ownership semantics. No policy for these relationships is authorized here. PR #10 is only a separate vehicle-policy proposal. RLS enabled with no SELECT policy can yield empty rows; empty UI is not proof of no jobs or successful isolation.
3. **Preview access and Auth redirect:** separately approve an exact candidate preview origin and its `/login` redirect in Supabase. Use permitted Vercel preview access. This PR changes neither configuration nor protection.
4. **Same-browser acceptance:** with approved test accounts/configuration, verify register → receive fresh link → verify/login → refresh → read own rows → switch account → reject cross-account rows → logout/login. Test expired/reused links, denied/offline states and 320/390/768px layouts. Never send customer email or mutate live records as part of this review.
5. **Commercial boundary:** posting, quoting, payments, subscriptions and entitlement remain unavailable. The public AI endpoint stays closed and must not invoke a provider. This is not a launched marketplace.
6. **Credential rotation:** the current candidate removes the exposed mailbox credential assignment; historical commits may retain it. The mailbox owner must rotate it outside chat. Do not retrieve or reuse it.

Record-read deadlines can abort their request, but the identity-check deadline only bounds the UI wait: the Supabase SDK request/auth lock is not cancelled and a permanently stalled transport may require reload. This limitation must remain visible at release review.

No live configuration, schema, data, email, billing or production change is authorized. Estimated hosted readiness remains **40%**, unchanged pending the gates above.
