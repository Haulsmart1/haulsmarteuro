// language.js - Handles language switching
document.addEventListener("DOMContentLoaded", function () {
    const languageSelect = document.getElementById("language-select");

    if (languageSelect) {
        languageSelect.addEventListener("change", function () {
            const selectedLanguage = this.value;
            alert("Language switched to: " + selectedLanguage);
        });
    }
});
