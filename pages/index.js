import Head from "next/head";
import Link from "next/link";
import CookieBanner from "@/components/CookieBanner";
import styles from "@/styles/pages/index.module.css";

const benefits = [
  ["01", "Tell us what needs moving", "Share the collection, delivery and goods details for a manual freight enquiry."],
  ["02", "Built for freight", "A focused route for UK and European transport requirements."],
  ["03", "Human follow-up", "Operations reviews each enquiry and responds directly. No automated booking or payment."],
];

export default function Home() {
  return <>
    <Head>
      <title>HaulSmart Europe | Freight, made clearer</title>
      <meta name="description" content="A clearer starting point for carriers and shippers arranging UK and European transport." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="google-site-verification" content="tRixieNsbQ4wPZpJKdwTh40OiK6C2kJ_LV73MnAeuDk" />
      <link rel="canonical" href="https://www.haulsmart-europe.com/" />
    </Head>
    <CookieBanner />
    <main className={styles.site}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="HaulSmart Europe home"><span className={styles.brandMark} aria-hidden="true">H</span><span>HaulSmart <small>EUROPE</small></span></Link>
        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/contact" className={styles.navLink}>Freight enquiry</Link>
          <Link href="/login" className={styles.navLink}>Existing customer login</Link>
        </nav>
      </header>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>UK &amp; EUROPEAN TRANSPORT</p>
          <h1>Freight, made clearer.</h1>
          <p className={styles.lede}>Send the essential freight details to operations for a manual quote and direct follow-up.</p>
          <div className={styles.actions}><Link href="/contact" className={styles.primaryButton}>Request a freight quote</Link><Link href="/login" className={styles.secondaryButton}>Existing customer login</Link></div>
          <p className={styles.helper}>The enquiry opens a prepared email for you to review and send. It does not create an automated booking, invoice or payment.</p>
        </div>
        <div className={styles.heroVisual} role="img" aria-label="A freight vehicle on the road">
          <div className={styles.visualTag}><span className={styles.statusDot} aria-hidden="true" /><span>HaulSmart Europe</span></div>
          <div className={styles.visualCaption}><span>TRANSPORT THAT CONNECTS</span><strong>One clear next step.</strong></div>
        </div>
      </section>
      <section className={styles.benefits} aria-labelledby="benefits-title">
        <div className={styles.sectionHeading}><p className={styles.eyebrow}>A CLEAR MANUAL SERVICE</p><h2 id="benefits-title">One direct route from enquiry to operations.</h2></div>
        <div className={styles.benefitGrid}>{benefits.map(([number,title,body]) => <article className={styles.benefitCard} key={number}><span className={styles.benefitNumber}>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>
      <footer className={styles.footer}><Link href="/" className={styles.footerBrand}>HaulSmart Europe</Link><div className={styles.footerLinks}><Link href="/contact">Freight enquiry</Link><Link href="/login">Existing customer login</Link></div><span>UK &amp; European transport</span></footer>
    </main>
  </>;
}
