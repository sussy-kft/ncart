import Lekerdezes from "./Lekerdezes";
import React from 'react';

function Allomasok()
{
    const [InfoPanels, setInfoPanels] = React.useState([]);

    function addInfoPanel(panel) {
        setInfoPanels([...InfoPanels, panel]);
    }    

    return (
        <>
            <div>Állomások</div>
            <Lekerdezes url={"allomasok"} addInfoPanel={addInfoPanel}/>
            <div>{InfoPanels}</div>
        </>
    );
}

export default Allomasok;