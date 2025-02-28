document.getElementById("language-selector-dropdown").addEventListener("change", function() {
    const lang = this.value;
    fetchTranslations(lang);
});

function fetchTranslations(lang) {
    const translations = {
        en: { title: "HaulSmart", register: "Register", login: "Login", contact: "Contact" },
        fr: { title: "HaulSmart", register: "S'inscrire", login: "Connexion", contact: "Contact" },
        de: { title: "HaulSmart", register: "Registrieren", login: "Anmelden", contact: "Kontakt" }
    };

    document.getElementById("title").textContent = translations[lang].title;
    document.getElementById("register").textContent = translations[lang].register;
    document.getElementById("login").textContent = translations[lang].login;
    document.getElementById("contact").textContent = translations[lang].contact;
}
