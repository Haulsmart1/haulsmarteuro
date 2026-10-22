// A failed network check is not proof that the user's session has expired.
export async function checkPortalIdentity(auth, { timeoutMs = 10_000 } = {}) {
  let timer;
  try {
    // Auth verification happens before the record-read deadlines. Bound its
    // visible result too, without treating a timeout as sign-out or trusting a
    // cached session. The SDK has no per-getUser AbortSignal; a late response
    // may settle its internal request but cannot change this returned result.
    const deadline = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error("Account check timed out")), timeoutMs);
    });
    const { data, error } = await Promise.race([auth.getUser(), deadline]);
    if (error) {
      const expired = error.name === "AuthSessionMissingError" ||
        ["session_not_found", "refresh_token_not_found", "refresh_token_already_used", "bad_jwt"].includes(error.code);
      return { status: expired ? "missing" : "retry", user: null };
    }
    return data?.user?.id ? { status: "authenticated", user: data.user } : { status: "missing", user: null };
  } catch {
    return { status: "retry", user: null };
  } finally {
    clearTimeout(timer);
  }
}

// Invalidate pending reads before React schedules the next account check.
// The event's session is never treated as a verified replacement identity.
export function handlePortalAuthChange(event, { invalidate, clear, recheck, signIn }) {
  if (!["SIGNED_OUT", "SIGNED_IN", "USER_UPDATED"].includes(event)) return;
  invalidate();
  clear();
  if (event === "SIGNED_OUT") signIn();
  else recheck();
}
