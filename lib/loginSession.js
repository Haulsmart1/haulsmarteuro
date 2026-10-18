// A browser session only selects the next page. The portal still verifies getUser.
// An old startup read must never override a newer sign-out or an unmounted page.
export function observeLoginSession(auth, { onSignedIn, onError }) {
  let active = true;
  let revision = 0;
  const { data } = auth.onAuthStateChange((event, session) => {
    if (!active) return;
    if (event === "SIGNED_OUT") revision += 1;
    if (event === "SIGNED_IN" && session?.user) {
      revision += 1;
      onSignedIn();
    }
  });
  const startupRevision = revision;
  void (async () => {
    try {
      // getSession does not carry errors from URL callback initialization.
      // Keep that result separately, without invalidating an existing session.
      const initialization = await auth.initialize();
      const result = await auth.getSession();
      if (!active || revision !== startupRevision) return;
      if (result.error) onError();
      else if (result.data?.session?.user) onSignedIn();
      else if (initialization.error) {
        onError(initialization.error.name === "AuthImplicitGrantRedirectError" ? "invalid_link" : undefined);
      }
    } catch {
      if (active && revision === startupRevision) onError();
    }
  })();
  return () => {
    active = false;
    data.subscription.unsubscribe();
  };
}
