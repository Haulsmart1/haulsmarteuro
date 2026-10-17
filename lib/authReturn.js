const PRODUCTION_RETURN_URL = "https://www.haulsmart-europe.com/login";

// Use the requesting deployment, so preview sign-in stays on its preview.
// Supabase must explicitly allow that deployment's /login URL.
export function getAuthReturnUrl(origin) {
  try {
    const url = new URL(origin);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (url.username || url.password || url.origin !== origin ||
      (url.protocol !== "https:" && !(local && url.protocol === "http:"))) return PRODUCTION_RETURN_URL;
    return `${url.origin}/login`;
  } catch { return PRODUCTION_RETURN_URL; }
}
