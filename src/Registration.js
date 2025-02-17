import React from "react";

function Registration() {
    return (
        <main>
            <h1>Register with HaulSmart</h1>
            <form>
                <input type="text" placeholder="Full Name" required />
                <input type="text" placeholder="Company Name" required />
                <input type="email" placeholder="Email" required />
                <input type="tel" placeholder="Phone Number" required />
                <button type="submit">Register</button>
            </form>
        </main>
    );
}

export default Registration;
