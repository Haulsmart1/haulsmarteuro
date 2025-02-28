import React, { useState } from "react";
import "./css/index.css";

const translations = {
  en: {
    title: "HaulSmart",
    subtitle: "Streamlined Logistics & Freight Exchange System",
    description: "Connecting freight with reliable transport across Europe.",
    register: "Register",
    login: "Login",
    contact: "Contact"
  },
  fr: {
    title: "HaulSmart",
    subtitle: "Système de logistique et d'échange de fret optimisé",
    description: "Connexion du fret avec un transport fiable à travers l'Europe.",
    register: "S'inscrire",
    login: "Connexion",
    contact: "Contact"
  },
  de: {
    title: "HaulSmart",
    subtitle: "Optimiertes Logistik- und Frachtaustauschsystem",
    description: "Verbindung von Fracht mit zuverlässigem Transport in ganz Europa.",
    register: "Registrieren",
    login: "Anmelden",
    contact: "Kontakt"
  },
  es: {
    title: "HaulSmart",
    subtitle: "Sistema de logística y comercio de carga optimizado",
    description: "Conectando carga con transporte confiable en toda Europa.",
    register: "Registro",
    login: "Iniciar sesión",
    contact: "Contacto"
  },
  it: {
    title: "HaulSmart",
    subtitle: "Sistema ottimizzato di logistica e scambio merci",
    description: "Collega il carico con trasporto affidabile in tutta Europa.",
    register: "Registrati",
    login: "Accedi",
    contact: "Contatto"
  },
  nl: {
    title: "HaulSmart",
    subtitle: "Geoptimaliseerd logistiek en vrachtuitwisselingssysteem",
    description: "Vracht verbinden met betrouwbaar transport door Europa.",
    register: "Registreren",
    login: "Inloggen",
    contact: "Contact"
  }
};

function Index() {
  const [language, setLanguage] = useState("en");

  return (
    <main className="index-page">
      <div className="language-selector">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">🇬🇧 English</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="es">🇪🇸 Español</option>
          <option value="it">🇮🇹 Italiano</option>
          <option value="nl">🇳🇱 Nederlands</option>
        </select>
      </div>

      <div className="hero">
        <h1>{translations[language].title}</h1>
        <h2>{translations[language].subtitle}</h2>
        <p>{translations[language].description}</p>
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