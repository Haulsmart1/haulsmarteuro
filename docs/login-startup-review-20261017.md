# Login startup recovery

Stacked on the consolidated account candidate, PR15, at 9eb17a66b6d3277bf4ef706884150f6c4505694c. This change does not alter the active repair branches.

A rejected initial session read previously had no rejection handler. A delayed successful read could also navigate to the portal after a newer sign-out or after leaving the login page. Startup now reports a recoverable error, ignores results from an older auth state or an unmounted page, and cleans up the listener. A response carrying both an error and a cached session cannot redirect.

Browser session presence selects the next page only. The portal still verifies the identity through getUser before fetching account records; this helper grants no data access or entitlement.

Eight new synthetic regression cases cover rejected reads, synchronous storage exceptions, error responses carrying stale sessions, unmount during success/failure, sign-out before a delayed result, sign-in before an older failure, and ordinary initial states. Hosted email delivery, actual browser storage behavior and end-to-end login acceptance remain separate release checks.

Original Neon marketplace source recovery, provider identity reconciliation and reviewed database ownership/RLS remain release blockers. No live data, policies, configuration, billing or email delivery changes are included.
