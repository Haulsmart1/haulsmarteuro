document.addEventListener("DOMContentLoaded", function() {
    const languageSelector = document.getElementById("language-selector-dropdown");

    // Load stored language
    if (localStorage.getItem("selectedLanguage")) {
        languageSelector.value = localStorage.getItem("selectedLanguage");
    }

    // Store new language
    languageSelector.addEventListener("change", function() {
        localStorage.setItem("selectedLanguage", this.value);
        location.reload();
    });
});
