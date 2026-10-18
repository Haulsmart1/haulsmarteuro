# Shared login/register navigation

On `/login?mode=register`, removing the query without remounting the page left
registration enabled and sent `shouldCreateUser: true` from the plain sign-in
route. Previously the local `mode` state was initialized from the route once,
and its effect only ever switched it to registration. `/register` also
re-exports the same component, so retained state during cross-route navigation
is covered by the synthetic lifecycle test too; browser reuse was not observed.

Derive mode directly from the current route/query. It is not independent
mutable state. Sign-in now disables account creation immediately on render;
explicit registration keeps the existing name metadata and email flow.

Regression tests execute the real page and real submit handler after JSX
transpilation, with a small synthetic state/effect lifecycle and mocked
framework/Auth I/O. Before the fix, register-to-login and cleared-query cases
failed with `shouldCreateUser: true`; ordinary login and registration passed.
All four cases pass with the route-derived mode. These are not browser or
hosted email acceptance tests, and send no messages or records.

Stacked on PR17 at `ac8e0518c47091bb12d7ce8fec7de28db2749b01`.
Existing repair branches and production are unchanged.
