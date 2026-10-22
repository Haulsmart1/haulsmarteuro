// Keep sign-out failures actionable, including network/storage exceptions.
export async function signOutPortalAccount(client) {
  try {
    if (!client) return false;
    const result = await client.auth.signOut();
    return !result.error;
  } catch {
    return false;
  }
}

// RLS remains the authority. These filters also limit the requested account data.
export async function readPortalData(client, userId, { timeoutMs = 10_000 } = {}) {
  if (!userId) throw new Error("Authentication required");
  const queries = {
    profile: () => client.from("users").select("id,full_name,company_name,status").eq("id", userId).limit(1),
    loads: () => client.from("live_loads").select("id,origin,destination,cargo_type,vehicle_type,miles,rate_per_mile,status,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(100),
    vehicles: () => client.from("vehicles").select("id,registration,type,available").eq("user_id", userId).order("registration").limit(100),
    invoices: () => client.from("invoices").select("id,invoice_number,total_amount,status,due_date,issued_at").or(`issued_by.eq.${userId},issued_to.eq.${userId}`).order("issued_at", { ascending: false }).limit(100),
  };
  return Object.fromEntries(await Promise.all(Object.entries(queries).map(async ([key, query]) => {
    const controller = new AbortController();
    let timer;
    try {
      // Bound each independent read: one stalled section must not hide all the
      // other records indefinitely. Abort real fetch I/O and also settle if a
      // custom transport ignores the signal. A fresh refresh starts new reads.
      const deadline = new Promise((_, reject) => {
        timer = setTimeout(() => { controller.abort(); reject(new Error("Workspace read timed out")); }, timeoutMs);
      });
      const result = await Promise.race([query().abortSignal(controller.signal), deadline]);
      return [key, { rows: result.error ? [] : result.data || [], error: Boolean(result.error) }];
    }
    catch { return [key, { rows: [], error: true }]; }
    finally { clearTimeout(timer); }
  })));
}
