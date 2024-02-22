import { createContext } from 'react';
import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = React.useState(localStorage.getItem("darkMode") === "true" || window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");

    return (
        <DarkModeContext.Provider value={{darkMode, setDarkMode}}>
            <HelmetProvider>
            <Helmet htmlAttributes={{"data-bs-theme": darkMode}}>
            </Helmet>
            {children}
            </HelmetProvider>
            {console.log(darkMode)}  
        </DarkModeContext.Provider>
    );
}