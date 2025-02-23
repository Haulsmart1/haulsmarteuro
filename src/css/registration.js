import React from "react";
import "./css/registration.css"; 

function Registration() {
    return (
        <main className="registration-page">
            <h1>Register with HaulSmart</h1>
            
            <section className="registration-form">
                <form>
                    <input type="text" placeholder="Full Name" required />
                    <input type="text" placeholder="Company Name" required />
                    <input type="email" placeholder="Email" required />
                    <input type="tel" placeholder="Phone Number" required />
                    <button type="submit">Register</button>
                </form>
            </section>
        </main>
    );
}

export default Registration;
