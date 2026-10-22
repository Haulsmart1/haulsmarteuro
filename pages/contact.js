import Head from "next/head";
import Link from "next/link";
import CookieBanner from "@/components/CookieBanner";
import { buildManualEnquiryMailto } from "@/lib/manualEnquiry";
import homeStyles from "@/styles/pages/index.module.css";
import styles from "@/styles/pages/contact.module.css";

export default function Contact() {
  const openEmailDraft = (event) => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget).entries());
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
          <p>Provide the essential collection, delivery and goods details. We will prepare them as an email for you to review and send to the HaulSmart Europe team.</p>
          <div className={styles.promise}>
            <strong>What happens next</strong>
            <ol>
              <li>Complete the freight details.</li>
              <li>Your email app opens with a prepared message.</li>
              <li>Review and send it; the team can then respond manually.</li>
            </ol>
          </div>
          <p className={styles.boundary}>This page does not create an automated booking, price, invoice or payment.</p>
        </div>

        <form className={styles.form} onSubmit={openEmailDraft} aria-describedby="submission-note">
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
          <button type="submit">Open email draft</button>
          <p id="submission-note" className={styles.note}>Your enquiry is not submitted until you send the prepared message from your email app.</p>
        </form>
      </section>

      <footer className={homeStyles.footer}><Link href="/" className={homeStyles.footerBrand}>HaulSmart Europe</Link><div className={homeStyles.footerLinks}><Link href="/contact">Freight enquiry</Link><Link href="/login">Existing customer login</Link></div><span>UK &amp; European transport</span></footer>
    </main>
  </>;
}
