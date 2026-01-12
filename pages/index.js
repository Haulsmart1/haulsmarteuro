import Head from "next/head";
import Link from "next/link";
import CookieBanner from "@/components/CookieBanner";
import styles from "@/styles/pages/index.module.css";

const cities = [
  "London", "Glasgow", "Manchester", "Birmingham", "Leeds", "Edinburgh",
  "Dublin", "Paris", "Lyon", "Marseille", "Berlin", "Munich", "Hamburg",
  "Frankfurt", "Stuttgart", "Vienna", "Budapest", "Prague", "Warsaw",
  "Krakow", "Lisbon", "Madrid", "Barcelona", "Rome", "Milan", "Athens",
  "Amsterdam", "Rotterdam", "Brussels", "Copenhagen", "Stockholm", "Helsinki",
  "Oslo", "Zurich", "Luxembourg", "Ljubljana"
];

export default function Home() {
  return (
    <>
      <Head>
        <title>European Freight Exchange | HaulSmart Freight Marketplace & Logistics Network</title>
        <meta
          name="description"
          content="HaulSmart European Freight Exchange – Premium logistics network connecting carriers & shippers across Europe. Freight marketplace, trucking routes, load matching, transport solutions."
        />
        <meta
          name="keywords"
          content="European Freight Exchange, Freight Marketplace, Logistics Network Europe, Trucking Loads, HaulSmart, Freight Matching, Road Transport Europe, Shipping Platform, Carrier Network, Load Board, Truck Loads UK, Freight Exchange London, Freight Exchange Paris, Freight Exchange Berlin, Freight Services Europe, Logistics Marketplace, Transport Exchange, Trucking Marketplace, European Logistics, Freight Jobs, Supply Chain Europe, Transport Solutions, Shipping Exchange, Digital Freight Network, Load Matching System"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="tRixieNsbQ4wPZpJKdwTh40OiK6C2kJ_LV73MnAeuDk" />
      </Head>

      <CookieBanner />

      <div className={styles.languageSwitcher}>
        <label htmlFor="language-select" className={styles.languageLabel}>🌍</label>
        <select id="language-select" aria-label="Select Language">
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </div>

      <div className={styles.hero}>
        <div className={styles.overlay}>
          <div className={styles.contentBox}>
            <h1>HaulSmart European Freight Exchange</h1>
            <p className={styles.subtitle}>Connecting Carriers & Shippers Across Europe</p>
            <p className={styles.launch}>Owner Operator Pre-Registration Now Open</p>

            <div className={styles.btnGroup}>
              <Link href="/login"><button className={`${styles.btn} ${styles.primary}`}>Login</button></Link>
              <Link href="/register"><button className={`${styles.btn} ${styles.primary}`}>Register</button></Link>
              <Link href="/contact"><button className={`${styles.btn} ${styles.primary}`}>Contact Us</button></Link>
              <Link href="/about"><button className={`${styles.btn} ${styles.primary}`}>About</button></Link>
              <Link href="/investor-login"><button className={`${styles.btn} ${styles.secondary}`}>Investors Portal</button></Link>
            </div>

            <div className={styles.citySection}>
              <p className={styles.cityTitle}>We serve freight and logistics operations in:</p>
              <div className={styles.cityGrid}>
                {cities.map(city => (
                  <Link
                    key={city}
                    href={`/cities/${city.toLowerCase().replace(/\s+/g, "-")}`}
                    className={styles.cityLink}
                  >
                    {city}
                  </Link>
                ))}
              </div>

              <p className={styles.seoText}>
                Our European freight exchange connects carriers and shippers with precision using advanced load boards,
                real-time freight matching, and route optimization tools across cities including London, Paris, Berlin, Madrid,
                Rome, Amsterdam, Brussels, Vienna, Warsaw, Budapest, and beyond.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ JSON-LD: WebSite Schema for SearchAction */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "HaulSmart Freight Exchange",
            "url": "https://www.haulsmart-europe.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.haulsmart-europe.com/?s={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      {/* ✅ JSON-LD: Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "HaulSmart Europe",
            "url": "https://www.haulsmart-europe.com",
            "logo": "https://www.haulsmart-europe.com/logo.png",
            "sameAs": [
              "https://www.linkedin.com/company/haul-smart-europe",
              "https://www.tiktok.com/@haulsmarteurope",
              "https://www.facebook.com/haulsmart"
            ],
            "description": "HaulSmart is Europe's smartest freight exchange platform. Find same-day courier jobs, return loads, and backhaul opportunities across Europe.",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+44-0800 999 1263",
              "contactType": "Customer Service"
            }
          })
        }}
      />
    </>
  );
}
