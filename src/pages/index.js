import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const [language, setLanguage] = useState('English');

  return (
    <>
      <Head>
        <title>HaulSmart - Europe&apos;s Freight Exchange</title>
        <meta
          name="description"
          content="The ultimate freight exchange platform for Return Loads, Express Couriers, and Dedicated Trucks."
        />
      </Head>

      <div className="hero">
        {/* Language Switcher (Top Right) */}
        <select
          className="language-switcher"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {[
            'English',
            'Français',
            'Deutsch',
            'Español',
            'Italiano',
            'Nederlands',
            'Português',
            'Polski',
            'Română',
            'Magyar',
            'Česky',
            'Slovenčina',
            'Dansk',
            'Svenska',
            'Suomi',
            'Norsk',
            'Ελληνικά',
            'Български',
            'Русский',
          ].map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        {/* Main Content */}
        <div className="content">
          <h1 className="display-4 text-white font-weight-bold">THE FUTURE OF FREIGHT IS HERE.</h1>
          <h2 className="h5 text-light">
            The Ultimate Platform for Return Loads, Express Couriers, and Dedicated Trucks.
          </h2>
          <p className="font-weight-bold text-warning">🚀 Launching August 2025</p>

          {/* Navigation Buttons */}
          <div className="buttons">
            <Link href="/dashboard">
              <button className="btn custom-btn">Dashboard</button>
            </Link>
            <Link href="/register">
              <button className="btn custom-btn">Register</button>
            </Link>
            <Link href="/contact">
              <button className="btn custom-btn">Contact Us</button>
            </Link>
          </div>
        </div>

        {/* Cookie Consent */}
        <div className="cookie-consent">
          This site uses cookies to enhance your experience. By continuing to browse, you agree to our cookie policy.
          <button className="btn accept-btn">Accept</button>
        </div>
      </div>

      <style jsx global>{`
        body {
          font-family: 'Poppins', sans-serif;
        }

        .hero {
          background: url('/assets/images/index-bg.jpg') no-repeat center center;
          background-size: cover;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          text-align: center;
          padding: 20px;
        }

        .language-switcher {
          position: absolute;
          top: 15px;
          right: 20px;
          padding: 5px;
          font-size: 14px;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          cursor: pointer;
        }

        .content {
          display: inline-block;
          padding: 30px;
          background: rgba(0, 0, 0, 0.7);
          box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.9);
          border-radius: 10px;
          color: white;
          max-width: 80%;
        }

        .buttons {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 15px;
        }

        .custom-btn {
          background-color: #007bff !important;
          color: white !important;
          font-size: 18px !important;
          border-radius: 8px !important;
          padding: 12px 24px !important;
          font-weight: bold !important;
        }

        .custom-btn:hover {
          background-color: #0056b3 !important;
        }

        .cookie-consent {
          position: absolute;
          bottom: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 10px;
          border-radius: 5px;
        }

        .accept-btn {
          margin-left: 10px;
          background-color: #28a745;
          border: none;
          color: white;
          padding: 5px 10px;
          border-radius: 5px;
        }

        .accept-btn:hover {
          background-color: #218838;
        }
      `}</style>
    </>
  );
}