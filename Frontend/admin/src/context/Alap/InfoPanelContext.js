import { createContext, useState } from 'react';

/**
 * @type {React.Context}
 */
export const InfoPanelContext = createContext();

/**
 * Egy Provider komponens, ami az InfoPanelContext-et adja a gyerekeinek.
 * @param {React.ReactNode} props.children Egy gyerek komponens, amit be akarunk ágyazni.
 * @returns {React.ReactNode} Egy Provider komponenst.
 */
export const InfoPanelProvider = ({ children }) => {
    /**
     * State hook, amely az info paneleket tárolja.
     * @type {Array.<(Object|Function)>}
     */
    const [InfoPanels, setInfoPanels] = useState([]);
    
    /**
     * Függvény, ami egy új info panelt ad hozzá az InfoPanels listához.
     * @param {Object} panel Amit hozzá akarunk adni a listához.
     */
    const addInfoPanel = (panel) => {
        setInfoPanels([...InfoPanels, panel]);
    }

    /**
     * Függvény, ami kitörli az összes info panelt az InfoPanels listából.
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