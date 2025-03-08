document.addEventListener('DOMContentLoaded', function () {
    // Form references
    const loginForm = document.getElementById('login-form');
    const registrationForm = document.getElementById('registration-form');
    const contactForm = document.getElementById('contact-form');
    const languageSelector = document.getElementById('language-selector');

    // Language Switcher
    document.getElementById("language-selector").addEventListener("change", function() {
        var selectedLang = this.value;
        alert("Switching to " + selectedLang + " (Feature to be implemented)");
        // Future: Implement language change feature
    });    

    // Login Form Validation
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!email || !password) {
                e.preventDefault();
                alert('Please fill in all fields.');
            }
        });
    }

    // Registration Form Validation
    if (registrationForm) {
        registrationForm.addEventListener('submit', function (e) {
            const fullName = document.getElementById('full-name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();

            if (!fullName || !email || !password || !confirmPassword) {
                e.preventDefault();
                alert('Please fill in all fields.');
            } else if (password !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match.');
            }
        });
    }

    // Contact Form Validation
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                e.preventDefault();
                alert('Please fill in all fields.');
            }
        });
    }
});
