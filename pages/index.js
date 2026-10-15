import Head from "next/head";
import Link from "next/link";
import CookieBanner from "@/components/CookieBanner";
import styles from "@/styles/pages/index.module.css";

const benefits = [
  ["01", "Clear account access", "Sign in or create an account with a simple, secure starting point."],
  ["02", "Built for freight", "A focused home for UK and European transport businesses."],
  ["03", "Support when you need it", "Keep the next step visible as your account is set up."],
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
          <Link href="/login" className={styles.navLink}>Sign in</Link>
          <Link href="/register" className={styles.navButton}>Create account</Link>
        </nav>
      </header>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>UK &amp; EUROPEAN TRANSPORT</p>
          <h1>Freight, made clearer.</h1>
          <p className={styles.lede}>A straightforward place for carriers and shippers to get started with HaulSmart Europe.</p>
          <div className={styles.actions}><Link href="/register" className={styles.primaryButton}>Create an account</Link><Link href="/login" className={styles.secondaryButton}>Sign in</Link></div>
          <p className={styles.helper}>Already have an account? <Link href="/login">Sign in here</Link>.</p>
        </div>
        <div className={styles.heroVisual} role="img" aria-label="A freight vehicle on the road">
          <div className={styles.visualTag}><span className={styles.statusDot} aria-hidden="true" /><span>HaulSmart Europe</span></div>
          <div className={styles.visualCaption}><span>TRANSPORT THAT CONNECTS</span><strong>One clear next step.</strong></div>
        </div>
      </section>
      <section className={styles.benefits} aria-labelledby="benefits-title">
        <div className={styles.sectionHeading}><p className={styles.eyebrow}>A BETTER STARTING POINT</p><h2 id="benefits-title">Everything begins with a clear account.</h2></div>
        <div className={styles.benefitGrid}>{benefits.map(([number,title,body]) => <article className={styles.benefitCard} key={number}><span className={styles.benefitNumber}>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>
      <footer className={styles.footer}><Link href="/" className={styles.footerBrand}>HaulSmart Europe</Link><div className={styles.footerLinks}><Link href="/login">Sign in</Link><Link href="/register">Create account</Link></div><span>UK &amp; European transport</span></footer>
    </main>
  </>;
}
