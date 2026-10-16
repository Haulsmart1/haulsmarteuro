# Preview sign-in return

The previous login always requested a magic link returning to production, even when opened on an isolated preview. The login now uses its browser origin plus `/login`, preserving the initiating deployment and browser session.

Before testing a preview, explicitly allow its exact `https://<deployment-host>/login` in the correct Supabase project's Auth redirect URLs. Keep the production Site URL unchanged; do not allow unrestricted external redirects. No Supabase configuration was changed by this PR.

Acceptance requires a fresh link requested and opened in the same browser on the approved preview, arrival at `/portal`, refresh persistence, and sign-out. The dashboard companion PR and reviewed database read policies remain separate prerequisites for viewing records. No billing or data writes are enabled.

Validation: `node --test lib/authReturn.test.js`. The preview return change does not itself prove successful email delivery or authenticated acceptance.
