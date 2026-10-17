// A failed network check is not proof that the user's session has expired.
export async function checkPortalIdentity(auth) {
  try {
    const { data, error } = await auth.getUser();
    if (error) {
      const expired = error.name === "AuthSessionMissingError" ||
        ["session_not_found", "refresh_token_not_found", "refresh_token_already_used", "bad_jwt"].includes(error.code);
      return { status: expired ? "missing" : "retry", user: null };
    }
    return data?.user?.id ? { status: "authenticated", user: data.user } : { status: "missing", user: null };
  } catch {
    return { status: "retry", user: null };
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
