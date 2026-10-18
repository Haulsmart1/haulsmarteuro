import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabaseClient";
import { getAuthReturnUrl } from "../lib/authReturn";
import { observeLoginSession } from "../lib/loginSession";
import styles from "../styles/pages/auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const mode = router.pathname === "/register" || router.query.mode === "register" ? "register" : "login";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return undefined;

    return observeLoginSession(supabase.auth, {
      onSignedIn: () => { void router.replace("/portal"); },
      onError: (kind) => setError(kind === "invalid_link"
        ? "That sign-in link is invalid or has expired. Enter your email below to request a new link."
        : "We couldn’t check your sign-in. Please try again."),
    });
  }, [router, router.pathname, router.query.mode]);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Account access is not configured for this deployment.");
      setBusy(false);
      return;
    }

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: getAuthReturnUrl(window.location.origin),
          shouldCreateUser: mode === "register",
          ...(mode === "register" ? { data: { full_name: name.trim() } } : {}),
        },
      });

      if (authError) {
        setError(authError.message);
      } else if (mode === "register") {
        setMessage("Check your email for a secure link to finish creating your account.");
      } else {
        setMessage("If an account uses that address, a secure sign-in link is on its way.");
      }
    } catch {
      setError("We couldn’t send the email link just now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const registering = mode === "register";

  return <>
    <Head>
      <title>{registering ? "Create an account" : "Sign in"} | HaulSmart Europe</title>
      <meta name="description" content="Secure, password-free access to your HaulSmart Europe account." />
    </Head>
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="HaulSmart Europe home">
        <span className={styles.brandMark} aria-hidden="true">H</span>
        <span>HaulSmart <small>EUROPE</small></span>
      </Link>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/login" className={styles.navLink}>Sign in</Link>
        <Link href="/register" className={styles.navButton}>Create account</Link>
      </nav>
    </header>
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="auth-title">
        <p className={styles.eyebrow}>{registering ? "GET STARTED" : "YOUR TRANSPORT ACCOUNT"}</p>
        <h1 id="auth-title">{registering ? "Create your account" : "Welcome back"}</h1>
        <p className={styles.intro}>
          {registering
            ? "Enter your work email and we’ll send a secure link to finish setting up your account."
            : "Enter the email address linked to your account. We’ll send you a secure sign-in link."}
        </p>
        <div className={styles.tabs} aria-label="Account access">
          <Link href="/login" aria-current={!registering ? "page" : undefined} className={!registering ? styles.activeTab : ""}>Sign in</Link>
          <Link href="/register" aria-current={registering ? "page" : undefined} className={registering ? styles.activeTab : ""}>Create account</Link>
        </div>
        <form className={styles.form} onSubmit={submit}>
          {registering && (
            <label className={styles.field}>
              <span>Your name</span>
              <input type="text" autoComplete="name" required maxLength={100} value={name} onChange={event => setName(event.target.value)} />
            </label>
          )}
          <label className={styles.field}>
            <span>Email address</span>
            <input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} />
          </label>
          {error && <p className={styles.error} role="alert">{error}</p>}
          {message && <p className={styles.notice} role="status">{message}</p>}
          <button className={styles.primaryButton} type="submit" disabled={busy}>
            {busy ? "Sending link…" : registering ? "Email me a sign-up link" : "Email me a sign-in link"}
          </button>
        </form>
        <p className={styles.helper}>No password needed. The link works once and expires for your security.</p>
        <Link className={styles.backLink} href="/">Back to HaulSmart Europe</Link>
      </section>
    </main>
    <footer className={styles.footer}>
      <Link href="/" className={styles.footerBrand}>HaulSmart Europe</Link>
      <div className={styles.footerLinks}>
        <Link href="/login">Sign in</Link>
        <Link href="/register">Create account</Link>
      </div>
      <span>UK &amp; European transport</span>
    </footer>
  </>;
}
