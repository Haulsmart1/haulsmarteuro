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
