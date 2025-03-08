
// Language switcher script for multi-language support
document.addEventListener("DOMContentLoaded", function () {
    const languageSelector = document.getElementById("language-selector");

    if (languageSelector) {
        languageSelector.addEventListener("change", function (event) {
            const selectedLanguage = event.target.value;
            console.log("Language switched to:", selectedLanguage);
            // Implement language switching logic here
        });
    }
});
