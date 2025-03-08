import React from "react";

export default function LanguageSwitcher({ setLocale }) {
    return (
        <div className="language-switcher">
            <select onChange={(e) => setLocale(e.target.value)}>
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
    );
}
