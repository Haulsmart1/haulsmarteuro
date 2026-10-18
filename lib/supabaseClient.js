import { createClient } from "@supabase/supabase-js";
let client;
export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!client) {
    try {
      client = createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    } catch {
      // Match the existing unavailable-client contract. Do not expose config
      // values through an exception or cache a failed construction attempt.
      return null;
    }
  }
  return client;
}
export const AUTH_RETURN_URL = "https://www.haulsmart-europe.com/login";
