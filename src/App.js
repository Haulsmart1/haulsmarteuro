import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Index from "./index";
import Login from "./pages/login";  // Updated path
import Registration from "./pages/registration";  // Updated path
import Contact from "./pages/contact";  // Updated path
import "./css/global.css";

function App() {
    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/registration">Register</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </Router>
    );
}

export default App;

