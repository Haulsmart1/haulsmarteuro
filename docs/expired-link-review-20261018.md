# Expired magic-link feedback

Reviewed on 18 October 2026 above PR18 (`af969e022619b7f6b378700d4be44aea0ecca2db`).

## Reproduced defect

The installed Supabase Auth SDK 2.90.1 returns an implicit callback error from
`initialize()`, but `getSession()` discards that initialization result and can
return `{data: {session: null}, error: null}`. The login observer only examined
`getSession()`, so an expired email link landed on the normal form without any
feedback about the failed attempt.

The new actual-SDK callback regression failed before the fix: no action was
reported instead of `invalid_link`. It uses a synthetic URL, in-memory storage,
fake sessions and a fetch stub that rejects every HTTP attempt.

## Change

Retain the initialization error separately from the subsequent session read.
An existing session still selects the portal, whose independent `getUser()`
verification is unchanged. Otherwise an implicit callback error offers a fixed,
safe message asking the user to request a new link. Raw URL descriptions and
tokens are never rendered or logged. Existing sign-out/unmount revision guards
continue to suppress stale results.

## Verification

- All 41 Node regressions passed, including seven added cases: actual SDK URL
  handling, expired-link feedback, ordinary signed-out entry, preserved existing
  sessions, initialization rejection, unmount races, and actual page feedback.
- Next.js 16.1.4 production build passed TypeScript and generated all six static
  pages. Dependencies were installed using the existing lockfile; no versions
  changed.
- SDK initialization behavior was checked against current Supabase docs and the
  installed SDK source. The current changelog's HTTP TLS cipher retirement does
  not change this browser callback behavior.

No hosted Auth request, email, database change or live configuration operation
was performed. Browser/mobile navigation and hosted email acceptance remain
pending. Marketplace source/identity reconciliation and ownership policies are
separate release blockers; readiness stays at an estimated 40%.
