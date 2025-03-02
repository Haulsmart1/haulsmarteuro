import React from 'react';
import './css/styles.css';

function App() {
    return (
        <div>
            {/* Home Page */}
            <div className="index">
                <div className="content-container">
                    <h1 data-lang="title">Welcome to HaulSmart</h1>
                    <p data-lang="subtitle">Streamlined Logistics & Freight Exchange System</p>
                    <div className="button-container">
                        <a href="/registration" className="btn" data-lang="register">Register</a>
                        <a href="/login" className="btn" data-lang="login">Login</a>
                        <a href="/contact" className="btn" data-lang="contact">Contact</a>
                    </div>
                </div>
            </div>

            {/* Contact Page */}
            <div className="contact">
                <div className="content-container">
                    <h1 data-lang="contact_title">Contact Us</h1>
                    <form>
                        <input type="text" placeholder="Your Name" required />
                        <input type="email" placeholder="Your Email" required />
                        <textarea placeholder="Your Message" required></textarea>
                        <button type="submit" className="btn">Send Message</button>
                    </form>
                    <a href="/" className="btn back-home" data-lang="back_to_home">Back to Home</a>
                </div>
            </div>

            {/* Login Page */}
            <div className="login">
                <div className="content-container">
                    <h1 data-lang="login">Login</h1>
                    <form>
                        <input type="email" placeholder="Email" required />
                        <input type="password" placeholder="Password" required />
                        <button type="submit" className="btn">Login</button>
                    </form>
                    <a href="/" className="btn back-home" data-lang="back_to_home">Back to Home</a>
                </div>
            </div>

            {/* Registration Page */}
            <div className="registration">
                <div className="content-container">
                    <h1 data-lang="register">Register</h1>
                    <form>
                        <input type="text" placeholder="Full Name" required />
                        <input type="email" placeholder="Email" required />
                        <input type="password" placeholder="Password" required />
                        <button type="submit" className="btn">Sign Up</button>
                    </form>
                    <a href="/" className="btn back-home" data-lang="back_to_home">Back to Home</a>
                </div>
            </div>

            {/* Language Switcher */}
            <div className="language-switcher">
                <select id="language-switcher">
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                    <option value="pt">Português</option>
                    <option value="nl">Nederlands</option>
                    <option value="pl">Polski</option>
                    <option value="ru">Русский</option>
                    <option value="sv">Svenska</option>
                    <option value="no">Norsk</option>
                    <option value="fi">Suomi</option>
                    <option value="da">Dansk</option>
                    <option value="cs">Čeština</option>
                    <option value="hu">Magyar</option>
                    <option value="el">Ελληνικά</option>
                    <option value="tr">Türkçe</option>
                    <option value="ro">Română</option>
                    <option value="bg">Български</option>
                    <option value="hr">Hrvatski</option>
                    <option value="sk">Slovenčina</option>
                    <option value="sl">Slovenščina</option>
                    <option value="et">Eesti</option>
                    <option value="lv">Latviešu</option>
                    <option value="lt">Lietuvių</option>
                    <option value="mt">Malti</option>
                </select>
            </div>
        </div>
    );
}

export default App;
