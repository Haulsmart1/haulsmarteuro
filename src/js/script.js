document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded");
    
    // Example: Form validation
    let form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", function (event) {
            let email = document.getElementById("email").value;
            if (!email.includes("@")) {
                alert("Please enter a valid email.");
                event.preventDefault();
            }
        });
    }
});
