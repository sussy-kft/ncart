import Lekerdezes from "./Lekerdezes";
import React, { useContext } from 'react';
import { InfoPanelContext } from '../context/InfoPanelContext';
import { ToastContainer } from 'react-bootstrap';

function Kezelok(props)
{   
    const {InfoPanels} = useContext(InfoPanelContext);

    return (
        <>
            <div>{props.cim}</div>
            <Lekerdezes url={props.url}/>
            <ToastContainer position="top-end" className="position-fixed">{InfoPanels}</ToastContainer>
        </>
    );
}

export default Kezelok;