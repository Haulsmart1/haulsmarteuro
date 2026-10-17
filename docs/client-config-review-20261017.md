# Recoverable browser client construction

The login startup effect, login submission and portal all call
`getSupabaseClient` before entering their own asynchronous error handling.
With a non-empty malformed project URL, the installed Supabase constructor
throws synchronously. This escapes the existing unavailable-client handling
and can crash the page or leave submission busy.

Return `null` when construction throws, matching missing configuration. The
existing submit and portal messages can then explain that account access is
not configured. Do not log configuration values or cache a failed attempt.
The successful client remains a singleton with the same session options.

Five synthetic regression tests exercise the actual installed SDK through the
application helper: three malformed URLs, missing configuration, and recovery
to a valid singleton. No Auth requests, records, email or hosted configuration
are used. This does not prove hosted login acceptance or solve the outstanding
marketplace source/identity/ownership reconciliation.

Stacked on PR16 at `0659495936eef7f14b0296cfe17c09e507c81ec9`;
existing repair branches are unchanged. No production release is authorized.
