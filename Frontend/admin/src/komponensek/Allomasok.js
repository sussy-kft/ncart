import { InfoPanelContext } from "../context/InfoPanelContext";
import Lekerdezes from "./Lekerdezes";
import React from 'react';

function Allomasok()
{
    const {InfoPanels} = React.createContext(InfoPanelContext);
    return (
        <>
            <div>Állomások</div>
            <Lekerdezes url={"allomasok"}/>
            <div>{InfoPanels}</div>
        </>
    );
}

export default Allomasok;