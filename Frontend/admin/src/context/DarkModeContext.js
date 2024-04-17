import { createContext, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

/**
 * @typedef {Object} Tema
 * @property {string} DARK - A sötét témát reprezentálja.
 * @property {string} LIGHT - A világos témát reprezentálja.
 * @description Egy objektum, ami a lehetséges téma értékeket tartalmazza.
 */
export const Tema = {
    DARK: 'dark',
    LIGHT: 'light'
};

/**
 * @type {React.Context}
 * @description Egy context, ami a jelenlegi háttér színét változttatja sötét és világos téma között.
 * Alapértelmezett értéke a böngésző alapértelmezett témája szerint álítja be a sötét vagy világos témát.
 * Továbbá rendelkezik egy függvénnyel, amivel a témák között lehet váltani.
 * Hogy ezek működjenek, a HelmetProvider komponensbe is beágyazza.
 */
export const DarkModeContext = createContext();

/**
 * @component
 * @param {React.ReactNode} children - Gyerek komponenst, amit majd beágyazunk a `DarkModeContext`-be.
 * @returns {React.Element} A gyerek komponenst, ami a `DarkModeContext`-et és a `HelmetProvider`-t tartalmazza.
 */
export const DarkModeProvider = ({ children }) => {
    
    /**
     * @type {Array} darkMode, setDarkMode
     * @description A `darkMode` és a `setDarkMode` a React state hook része.
     * `darkMode` egy string, ami a jelenlegi témát reprezentálja ("dark" vagy "light").
     * `setDarkMode` egy függvény, ami frissíti a `darkMode` állapotot.
     * Alapmérezetten a `darkMode` állapotot a localStorage-ban található "darkMode" elemet vizsgálja, hogy igaz-e vagy a felhasználó rendszere sötét témát prefelálja.
     * Ha bármelyik feltétel igaz, akkor a kezdeti állapot sötét módra van állítva, egyébként világos módra.
     */
    const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true" || window.matchMedia('(prefers-color-scheme: dark)').matches ? Tema.DARK : Tema.LIGHT);

    /**
     * @function getText
     * @returns {string} A jelenlegi téma állapota.
     */
    const getText = () => {
        return darkMode;
    }
    
    return (
        <DarkModeContext.Provider value={{setDarkMode, getText}}>
            <HelmetProvider>
                <Helmet htmlAttributes={{"data-bs-theme": darkMode}}/>
                {children}
            </HelmetProvider>
        </DarkModeContext.Provider>
    );
}