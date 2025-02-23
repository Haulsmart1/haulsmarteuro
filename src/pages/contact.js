import React from "react";
import "./css/registration.css";

function Contact() {
    return (
        <main>
            <h1>Contact HaulSmart Euro</h1>
            <p>Email us at <a href="mailto:help@haulsmart-europe.com">help@haulsmart-europe.com</a></p>
            <form>
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Your Email" required />
                <textarea placeholder="Your Message"></textarea>
                <button type="submit">Send</button>
            </form>
        </main>
    );
}

export default Contact;
