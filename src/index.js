document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript is running!");
    const container = document.querySelector(".container");
    if (container) {
        console.log("Container found!", container);
    } else {
        console.error("Container is missing!");
    }
});
