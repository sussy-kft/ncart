import Lekerdezes from "./Lekerdezes";
import React, { useContext } from 'react';
import { InfoPanelContext } from '../context/InfoPanelContext';

function Kezelok()
{   
    const {InfoPanels} = useContext(InfoPanelContext);

    return (
        <>
            <div>Kezelők</div>
            <InfoPanelProvider>
                <Lekerdezes url={"kezelok"}/>
                <div>{InfoPanels}</div>
            </InfoPanelProvider>
        </>
    );
}

export default Kezelok;