import { useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import CookieBanner from "@/components/CookieBanner";
import { buildManualEnquiryMailto, MANUAL_ENQUIRY_EMAIL } from "@/lib/manualEnquiry";
import homeStyles from "@/styles/pages/index.module.css";
import styles from "@/styles/pages/contact.module.css";

export default function Contact() {
  const [submission, setSubmission] = useState({ kind: "idle", message: "" });
  const idempotencyKey = useRef(null);

  const submitEnquiry = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmission({ kind: "sending", message: "Sending your enquiry securely…" });

    try {
      idempotencyKey.current ||= window.crypto.randomUUID();
      const fields = Object.fromEntries(new FormData(form).entries());
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current,
        },
        body: JSON.stringify(fields),
        credentials: "same-origin",
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) {
        setSubmission({ kind: "error", message: result.message || "We could not submit your enquiry. Please try again or use the email option below." });
        return;
      }

      form.reset();
      idempotencyKey.current = null;
      setSubmission({ kind: "success", message: result.message });
    } catch {
      setSubmission({ kind: "error", message: "We could not reach the submission service. Your details are still here; please try again or use the email option below." });
    }
  };

  const openEmailDraft = (event) => {
    const form = event.currentTarget.form;
    const fields = Object.fromEntries(new FormData(form).entries());
    window.location.assign(buildManualEnquiryMailto(fields));
  };

  return <>
    <Head>
      <title>Request a freight quote | HaulSmart Europe</title>
      <meta name="description" content="Prepare a freight enquiry for the HaulSmart Europe operations team." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <CookieBanner />
    <main className={homeStyles.site}>
      <header className={homeStyles.header}>
        <Link href="/" className={homeStyles.brand} aria-label="HaulSmart Europe home"><span className={homeStyles.brandMark} aria-hidden="true">H</span><span>HaulSmart <small>EUROPE</small></span></Link>
        <nav className={homeStyles.nav} aria-label="Main navigation">
          <Link href="/contact" className={homeStyles.navLink} aria-current="page">Freight enquiry</Link>
          <Link href="/login" className={homeStyles.navLink}>Existing customer login</Link>
        </nav>
      </header>

      <section className={styles.layout}>
        <div className={styles.intro}>
          <p className={homeStyles.eyebrow}>MANUAL FREIGHT ENQUIRY</p>
          <h1>Tell our operations team what needs moving.</h1>
          <p>Send the essential collection, delivery and goods details directly to the HaulSmart Europe operations team.</p>
          <div className={styles.promise}>
            <strong>What happens next</strong>
            <ol>
              <li>Complete your freight and contact details.</li>
              <li>Submit them securely on this website.</li>
              <li>Our operations team will review your enquiry and reply manually.</li>
            </ol>
          </div>
          <p className={styles.boundary}>This page does not create an automated booking, price, invoice or payment.</p>
        </div>

        <form className={styles.form} onSubmit={submitEnquiry} aria-describedby="submission-note" aria-busy={submission.kind === "sending"}>
          <div className={styles.honeypot} aria-hidden="true">
            <label>Leave this field empty<input name="website" tabIndex="-1" autoComplete="off" /></label>
          </div>
          <div className={styles.fieldGrid}>
            <label>Name<input name="name" autoComplete="name" required /></label>
            <label>Company<input name="company" autoComplete="organization" required /></label>
            <label>Email<input name="replyEmail" type="email" autoComplete="email" required /></label>
            <label>Phone <span>(optional)</span><input name="phone" type="tel" autoComplete="tel" /></label>
            <label>Collection location<input name="origin" autoComplete="street-address" required /></label>
            <label>Delivery location<input name="destination" required /></label>
          </div>
          <label>Goods and load details<textarea name="goods" rows="5" placeholder="Describe the goods, quantity, weight, dimensions and any special handling requirements." required /></label>
          <label>Preferred timing <span>(optional)</span><input name="timing" placeholder="Collection date or delivery deadline" /></label>
          <button type="submit" disabled={submission.kind === "sending"}>{submission.kind === "sending" ? "Sending…" : "Send freight enquiry"}</button>
          <p id="submission-note" className={`${styles.note} ${submission.kind === "error" ? styles.error : ""} ${submission.kind === "success" ? styles.success : ""}`} role="status" aria-live="polite">
            {submission.message || "Your details are sent only after the operations mailbox accepts the message."}
          </p>
          <p className={styles.note}>Prefer email or having trouble submitting? Your details are also available in a prepared email to <a href={`mailto:${MANUAL_ENQUIRY_EMAIL}`}>{MANUAL_ENQUIRY_EMAIL}</a>.</p>
          <button type="button" className={styles.secondaryButton} onClick={openEmailDraft}>Use email app instead</button>
        </form>
      </section>

      <footer className={homeStyles.footer}><Link href="/" className={homeStyles.footerBrand}>HaulSmart Europe</Link><div className={homeStyles.footerLinks}><Link href="/contact">Freight enquiry</Link><Link href="/login">Existing customer login</Link></div><span>UK &amp; European transport</span></footer>
    </main>
  </>;
}
