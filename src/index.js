// index.js
import React, { useState, useEffect } from 'react';
import './css/styles.css';

// The background image source can be changed dynamically depending on the language
const bgImage = `${process.env.PUBLIC_URL}/images/index-bg.jpg`;

const translations = {
  en: { title: "HaulSmart", subtitle: "Freight Exchange System", register: "Register", login: "Login", contact: "Contact" },
  fr: { title: "HaulSmart", subtitle: "Système d'échange de fret", register: "S'inscrire", login: "Connexion", contact: "Contact" },
  de: { title: "HaulSmart", subtitle: "Frachtaustauschsystem", register: "Registrieren", login: "Anmelden", contact: "Kontakt" },
  // Add additional languages as needed
};

function Index() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    // Load the language from localStorage if it exists
    const savedLanguage = localStorage.getItem('lang');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem('lang', selectedLanguage); // Save the selected language to localStorage
  };

  return (
    <main
      className="index-page"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
      <div className="language-selector">
        <select value={language} onChange={handleLanguageChange}>
          <option value="en">🇬🇧 English</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="de">🇩🇪 Deutsch</option>
          {/* Add other languages here */}
        </select>
      </div>
      <div className="hero">
        <h1>{translations[language].title}</h1>
        <h2>{translations[language].subtitle}</h2>
        <div className="button-container">
          <a href="/registration" className="btn">{translations[language].register}</a>
          <a href="/login" className="btn">{translations[language].login}</a>
          <a href="/contact" className="btn">{translations[language].contact}</a>
        </div>
      </div>
    </main>
  );
}

export default Index;


