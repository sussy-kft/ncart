import { createContext } from 'react';
import React from 'react';

export const InfoPanelContext = createContext();

export const InfoPanelProvider = ({ children }) => {
    const [InfoPanels, setInfoPanels] = React.useState([]);
    
    const addInfoPanel = (panel) => {
        setInfoPanels([...InfoPanels, panel]);
    }

    return (
        <InfoPanelContext.Provider value={{addInfoPanel, InfoPanels}}>
            {children}  
        </InfoPanelContext.Provider>
    );
}