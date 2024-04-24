import { createContext, useState } from 'react';

/**
 * @description Egy context, ami az info panelek változóit és metódusait biztosítja.
 * @type {React.Context}
 * @module InfoPanelContext
 */
export const InfoPanelContext = createContext();

/**
 * Egy Provider komponens, ami az InfoPanelContext-et adja a gyerekeinek.
 * @component
 * @memberof InfoPanelContext
 * @param {Object} props A komponens propsa.
 * @param {React.ReactNode} props.children Egy gyerek komponens, amit be akarunk ágyazni.
 * @returns {React.ReactNode} Egy gyerek komponenst, ami InfoPanelContext-tel van beágyazva.
 */
export const InfoPanelProvider = ({ children }) => {
    /**
     * State hook, amely az info paneleket tárolja.
     * @memberof InfoPanelContext
     * @type {Array.<(Object|Function)>}
     */
    const [InfoPanels, setInfoPanels] = useState([]);

    /**
     * Függvény, ami egy új info panelt ad hozzá az InfoPanels listához.
     * @memberof InfoPanelContext
     * @function
     * @param {Object} panel Amit hozzá akarunk adni a listához.
     */
    const addInfoPanel = (panel) => {
        setInfoPanels([...InfoPanels, panel]);
    }

    /**
     * Függvény, ami kitörli az összes info panelt az InfoPanels listából.
     * @memberof InfoPanelContext
     * @function
     */
    const resetInfoPanel = () => {
        setInfoPanels([]);
    }

    return (
        <InfoPanelContext.Provider value={{addInfoPanel, resetInfoPanel, InfoPanels}}>
            {children}  
        </InfoPanelContext.Provider>
    );
}