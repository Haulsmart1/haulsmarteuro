import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabaseClient";
import styles from "../styles/pages/auth.module.css";

export default function PortalPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) { setError("Account access is not configured for this deployment."); setLoading(false); return undefined; }
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) setError(sessionError.message);
      if (data.session?.user) setUser(data.session.user); else router.replace("/login");
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session?.user) { setUser(null); router.replace("/login"); }
      else setUser(session.user);
    });
    return () => data.subscription.unsubscribe();
  }, [router]);
  async function signOut() {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError(signOutError.message); else await router.replace("/");
  }
  return <>
    <Head><title>Your account | HaulSmart Europe</title></Head>
    <main className={styles.page}><section className={styles.card} aria-labelledby="portal-title">
      <Link className={styles.brand} href="/"><span className={styles.brandMark} aria-hidden="true">H</span><span>HaulSmart <small>EUROPE</small></span></Link>
      <p className={styles.eyebrow}>ACCOUNT</p><h1 id="portal-title">{loading ? "Checking your account…" : "You’re signed in"}</h1>
      {!loading && user && <><p className={styles.intro}>Signed in as <strong>{user.user_metadata?.full_name || user.email}</strong>.</p>
        <div className={styles.accountNote}>Your account is connected. Freight board and payment features are not enabled in this portal yet.</div>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className={styles.primaryButton} type="button" onClick={signOut}>Sign out</button></>}
      {!loading && error && !user && <p className={styles.error} role="alert">{error}</p>}
      <Link className={styles.backLink} href="/">Back to HaulSmart Europe</Link>
    </section></main>
  </>;
}
