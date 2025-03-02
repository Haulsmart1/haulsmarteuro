// language.js
document.addEventListener('DOMContentLoaded', function() {
    const translations = {
        en: {
            title: "HaulSmart",
            subtitle: "Streamlined Logistics & Freight Exchange System",
            register: "Register",
            login: "Login",
            contact: "Contact",
            contact_title: "Contact Us",
            contact_description: "We'd love to hear from you! Reach out to us for any inquiries or assistance.",
            launch_notice: "Official Launch July 2025",
            back_to_home: "Back to Home",
            // Add more keys for other pages...
        },
        es: {
            title: "HaulSmart",
            subtitle: "Sistema de intercambio de carga",
            register: "Registrarse",
            login: "Iniciar sesión",
            contact: "Contacto",
            contact_title: "Contáctanos",
            contact_description: "¡Nos encantaría saber de ti! Contáctanos para cualquier consulta o asistencia.",
            launch_notice: "Lanzamiento oficial julio de 2025",
            back_to_home: "Volver al inicio",
            // Add more keys for other pages...
        },
        // Add other languages here...
    };

    const languageSwitcher = document.getElementById('language-switcher');
    const lang = localStorage.getItem('lang') || 'en'; // Default to English if no language is selected

    // Apply the selected language to the page
    function applyTranslations(language) {
        const elements = document.querySelectorAll('[data-lang]');

        elements.forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[language] && translations[language][key]) {
                element.textContent = translations[language][key];
            }
        });
    }

    // Set the language
    languageSwitcher.value = lang;
    applyTranslations(lang);

    // Change language based on user selection
    languageSwitcher.addEventListener('change', function(event) {
        const selectedLang = event.target.value;
        localStorage.setItem('lang', selectedLang);
        applyTranslations(selectedLang);
    });
});
