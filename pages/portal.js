import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabaseClient";
import { readPortalData } from "../lib/portalData";
import styles from "../styles/pages/portal.module.css";

const tabs = ["Overview", "My loads", "Fleet", "Invoices", "Account"];
const currency = (value) => value == null ? "Not recorded" : new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value);
export default function PortalPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("Overview");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const client = getSupabaseClient();
    let active = true;
    if (!client) { setError("Account access is not configured for this deployment."); setLoading(false); return; }
    async function load() {
      setLoading(true); setData(null); setError("");
      try {
        const { data: identity, error: failure } = await client.auth.getUser();
        if (!active) return;
        if (failure || !identity.user) { setUser(null); router.replace("/login"); return; }
        setUser(identity.user);
        const result = await readPortalData(client, identity.user.id);
        if (active) setData(result);
      } catch { if (active) setError("Your workspace could not be loaded. Please refresh to try again."); }
      finally { if (active) setLoading(false); }
    }
    load();
    const { data: listener } = client.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") { active = false; setUser(null); setData(null); router.replace("/login"); }
      if (event === "SIGNED_IN" || event === "USER_UPDATED") setRefresh((value) => value + 1);
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [router, refresh]);
  async function signOut() {
    const { error: failure } = await getSupabaseClient().auth.signOut();
    if (failure) setError("Sign out failed. Please try again.");
  }
  function records(key, render) {
    if (loading) return <p role="status">Loading your records…</p>;
    if (!data || data[key].error) return <p role="alert">These records could not be retrieved. Refresh to retry; your account permissions may need checking.</p>;
    if (!data[key].rows.length) return <p>No records are visible to your account yet. Access restrictions can also return an empty list.</p>;
    return render(data[key].rows);
  }
  const profile = data?.profile?.rows?.[0];
  return <><Head><title>Your workspace | HaulSmart Europe</title><meta name="robots" content="noindex,nofollow" /></Head>
    <main className={styles.page}><header className={styles.header}><Link href="/" className={styles.brand}>HaulSmart <small>EUROPE</small></Link>{user && <button type="button" onClick={signOut}>Sign out</button>}</header>
      {error && <p role="alert" className={styles.panel}>{error}</p>}
      {!user ? <p role="status">{loading ? "Checking your account…" : "Sign in to open your workspace."}</p> : <div className={styles.workspace}>
        <nav className={styles.nav} aria-label="Workspace">{tabs.map((item) => <button type="button" key={item} aria-current={tab === item ? "page" : undefined} onClick={() => setTab(item)}>{item}</button>)}</nav>
        <div className={styles.content}><p className={styles.eyebrow}>YOUR TRANSPORT WORKSPACE</p><h1>{tab === "Overview" ? "Welcome aboard" : tab}</h1><p>{profile?.company_name || user.email}</p><button type="button" disabled={loading} onClick={() => setRefresh((value) => value + 1)}>Refresh records</button>
          {tab === "Overview" && <><div className={styles.stats}>{[["loads", "My loads"], ["vehicles", "Fleet"], ["invoices", "Invoices"]].map(([key, label]) => <button type="button" key={key} onClick={() => setTab(label)}><span>{label}</span><strong>{loading ? "…" : data && !data[key].error ? `${data[key].rows.length}${data[key].rows.length === 100 ? "+" : ""}` : "Unavailable"}</strong><small>Visible records →</small></button>)}</div><section className={styles.panel}><h2>Your next steps</h2><p>Review your loads, fleet and invoices in one place. This workspace currently supports viewing your records.</p><button type="button" onClick={() => setTab("My loads")}>View my loads</button></section><section className={styles.panel}><h2>Payments</h2><p>Online payment and subscription activation are not enabled here. No payment is taken in this workspace.</p></section></>}
          {tab === "My loads" && <section className={styles.panel}><label htmlFor="load-search">Search visible loads</label><input id="load-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Origin, destination, cargo or status" />{records("loads", (rows) => { const filtered = rows.filter((row) => `${row.origin || ""} ${row.destination || ""} ${row.cargo_type || ""} ${row.status || ""}`.toLowerCase().includes(search.toLowerCase())); return filtered.length ? <ul className={styles.records}>{filtered.map((row) => <li key={row.id}><h2>{row.origin || "Origin not recorded"} → {row.destination || "Destination not recorded"}</h2><span className={styles.badge}>{row.status || "Status not recorded"}</span><p>{row.cargo_type || "Cargo not recorded"} · {row.vehicle_type || "Vehicle not recorded"}</p><p>{row.miles == null ? "Distance not recorded" : `${row.miles} miles`} · {row.rate_per_mile == null ? "Rate not recorded" : `${currency(row.rate_per_mile)}/mile`}</p></li>)}</ul> : <p>No loads match your search.</p>; })}</section>}
          {tab === "Fleet" && <section className={styles.panel}>{records("vehicles", (rows) => <ul className={styles.records}>{rows.map((row) => <li key={row.id}><h2>{row.registration || "Registration not recorded"}</h2><p>{row.type || "Type not recorded"}</p><span className={styles.badge}>{row.available == null ? "Availability not recorded" : row.available ? "Available" : "Unavailable"}</span></li>)}</ul>)}</section>}
          {tab === "Invoices" && <section className={styles.panel}><p>Invoice records only. Online payment is not enabled.</p>{records("invoices", (rows) => <ul className={styles.records}>{rows.map((row) => <li key={row.id}><h2>{row.invoice_number || "Reference not recorded"}</h2><strong>{currency(row.total_amount)}</strong><p>{row.status || "Status not recorded"} · Due {row.due_date || "date not recorded"}</p></li>)}</ul>)}</section>}
          {tab === "Account" && <section className={styles.panel}><h2>Account details</h2><dl><dt>Email</dt><dd>{user.email}</dd><dt>Company</dt><dd>{profile?.company_name || "Not available"}</dd><dt>Name</dt><dd>{profile?.full_name || "Not available"}</dd><dt>Status</dt><dd>{profile?.status || "Not available"}</dd></dl>{data?.profile?.error && <p role="alert">Your profile could not be retrieved.</p>}<p>Need help? <a href="mailto:support@tmswizard.com">support@tmswizard.com</a></p></section>}
          <p className={styles.footnote}>Showing up to 100 records per section. <Link href="/">Back to HaulSmart Europe</Link></p>
        </div></div>}
    </main></>;
}
