import React, { useState } from "react";
import { IntlProvider, FormattedMessage } from "react-intl";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./css/styles.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import LanguageSwitcher from "./components/LanguageSwitcher";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import it from "./locales/it.json";
import pt from "./locales/pt.json";
import nl from "./locales/nl.json";
import pl from "./locales/pl.json";
import ru from "./locales/ru.json";
import sv from "./locales/sv.json";
import no from "./locales/no.json";
import fi from "./locales/fi.json";
import da from "./locales/da.json";
import cs from "./locales/cs.json";
import hu from "./locales/hu.json";
import el from "./locales/el.json";
import tr from "./locales/tr.json";
import ro from "./locales/ro.json";
import bg from "./locales/bg.json";
import hr from "./locales/hr.json";
import sk from "./locales/sk.json";
import sl from "./locales/sl.json";
import et from "./locales/et.json";
import lv from "./locales/lv.json";
import lt from "./locales/lt.json";
import mt from "./locales/mt.json";

const messages = {
    en, es, fr, de, it, pt, nl, pl, ru, sv, no, fi, da, cs, hu, el, tr, ro, bg, hr, sk, sl, et, lv, lt, mt
};

function App() {
    const [locale, setLocale] = useState("en");

    return (
        <IntlProvider locale={locale} messages={messages[locale]}>
            <Router>
                <div className="app-container">
                    <LanguageSwitcher setLocale={setLocale} />
                    <Routes>
                        <Route path="/" element={
                            <div className="index">
                                <h1><FormattedMessage id="title" /></h1>
                                <p><FormattedMessage id="subtitle" /></p>
                                <div className="button-container">
                                    <Link to="/dashboard" className="btn">
                                        <FormattedMessage id="dashboard" />
                                    </Link>
                                    <Link to="/login" className="btn">
                                        <FormattedMessage id="login" />
                                    </Link>
                                    <Link to="/registration" className="btn">
                                        <FormattedMessage id="register" />
                                    </Link>
                                    <Link to="/contact" className="btn">
                                        <FormattedMessage id="contact" />
                                    </Link>
                                </div>
                            </div>
                        } />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/registration" element={<Register />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </div>
            </Router>
        </IntlProvider>
    );
}

export default App;
