import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSupabaseClient, AUTH_RETURN_URL } from "../lib/supabaseClient";
import styles from "../styles/pages/auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState(router.pathname === "/register" || router.query.mode === "register" ? "register" : "login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [recovery, setRecovery] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (router.pathname === "/register" || router.query.mode === "register") setMode("register");
    if (router.query.verified === "1") setMessage("Email confirmed. Sign in to continue.");
    const supabase = getSupabaseClient();
    if (!supabase) return undefined;
    if (window.location.hash.includes("type=recovery") || router.query.recovery === "1") setRecovery(true);
    const { data } = supabase.auth.onAuthStateChange(event => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
    return () => data.subscription.unsubscribe();
  }, [router.query.mode, router.query.recovery, router.query.verified]);

  async function submit(event) {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    const supabase = getSupabaseClient();
    if (!supabase) { setError("Account access is not configured for this deployment."); setBusy(false); return; }
    if (recovery) {
      const { error: authError } = await supabase.auth.updateUser({ password: newPassword });
      setBusy(false);
      if (authError) { setError(authError.message); return; }
      setRecovery(false); setNewPassword(""); setMessage("Password updated. Sign in with your new password."); return;
    }
    if (mode === "register") {
      const { data, error: authError } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name.trim() }, emailRedirectTo: AUTH_RETURN_URL + "?verified=1" },
      });
      setBusy(false);
      if (authError) { setError(authError.message); return; }
      if (data.session) { await router.replace("/portal"); return; }
      setMessage("Check your email for a confirmation link. After confirming, sign in here."); return;
    }
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (authError) { setError(authError.message); return; }
    await router.replace("/portal");
  }

  async function resetPassword() {
    setBusy(true); setError(""); setMessage("");
    const supabase = getSupabaseClient();
    if (!supabase) { setError("Account access is not configured for this deployment."); setBusy(false); return; }
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: AUTH_RETURN_URL + "?recovery=1" });
    setBusy(false);
    if (authError) { setError(authError.message); return; }
    setMessage("If an account uses that address, a password reset email is on its way.");
  }

  const registering = mode === "register";
  return <>
    <Head><title>{recovery ? "Reset password" : registering ? "Create an account" : "Sign in"} | HaulSmart Europe</title><meta name="description" content="Secure access to your HaulSmart Europe account." /></Head>
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="auth-title">
        <Link className={styles.brand} href="/"><span className={styles.brandMark} aria-hidden="true">H</span><span>HaulSmart <small>EUROPE</small></span></Link>
        {!recovery && <div className={styles.tabs} role="tablist" aria-label="Account access">
          <button role="tab" aria-selected={!registering} className={!registering ? styles.activeTab : ""} onClick={() => { setMode("login"); setMessage(""); setError(""); router.replace("/login"); }} type="button">Sign in</button>
          <button role="tab" aria-selected={registering} className={registering ? styles.activeTab : ""} onClick={() => { setMode("register"); setMessage(""); setError(""); router.replace("/register"); }} type="button">Create account</button>
        </div>}
        <p className={styles.eyebrow}>{recovery ? "ACCOUNT RECOVERY" : registering ? "GET STARTED" : "YOUR TRANSPORT ACCOUNT"}</p>
        <h1 id="auth-title">{recovery ? "Choose a new password" : registering ? "Create your account" : "Welcome back"}</h1>
        <p className={styles.intro}>{recovery ? "Set a new password to restore account access." : registering ? "Use your work email to set up secure access." : "Sign in with the email address linked to your account."}</p>
        <form className={styles.form} onSubmit={submit}>
          {registering && !recovery && <label className={styles.field}><span>Your name</span><input type="text" autoComplete="name" required maxLength={100} value={name} onChange={e => setName(e.target.value)} /></label>}
          {!recovery && <label className={styles.field}><span>Email address</span><input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>}
          {recovery
            ? <label className={styles.field}><span>New password</span><input type="password" autoComplete="new-password" required minLength={8} value={newPassword} onChange={e => setNewPassword(e.target.value)} /><small>Use at least 8 characters.</small></label>
            : <label className={styles.field}><span>Password</span><input type="password" autoComplete={registering ? "new-password" : "current-password"} required minLength={registering ? 8 : undefined} value={password} onChange={e => setPassword(e.target.value)} />{registering && <small>Use at least 8 characters.</small>}</label>}
          {error && <p className={styles.error} role="alert">{error}</p>}
          {message && <p className={styles.notice} role="status">{message}</p>}
          <button className={styles.primaryButton} type="submit" disabled={busy}>{busy ? "Please wait…" : recovery ? "Update password" : registering ? "Create account" : "Sign in"}</button>
        </form>
        {!registering && !recovery && <button type="button" className={styles.textButton} disabled={busy || !email} onClick={resetPassword}>Forgot your password?</button>}
        <Link className={styles.backLink} href="/">Back to HaulSmart Europe</Link>
      </section>
      <aside className={styles.sidePanel}><p className={styles.sideLabel}>HAULSMART EUROPE</p><h2>Freight moves better with clarity.</h2><p>Keep your account access in one place as you get set up.</p><div className={styles.sideRule} /><p className={styles.sideFoot}>Secure account access · UK and European transport</p></aside>
    </main>
  </>;
}
