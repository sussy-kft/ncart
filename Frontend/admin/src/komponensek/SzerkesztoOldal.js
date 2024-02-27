import Lekerdezes from "./Lekerdezes";
import React, { useContext } from 'react';
import { InfoPanelContext } from '../context/InfoPanelContext';
import { ToastContainer } from 'react-bootstrap';
import InputMezo from "./InputMezo";

function Kezelok(props)
{   
    const {InfoPanels} = useContext(InfoPanelContext);

    return (
        <>
            <InputMezo url={props.url}></InputMezo>
            <h1>{props.cim}</h1>
            <Lekerdezes url={props.url}/>
            <ToastContainer position="top-end" className="position-fixed">{InfoPanels}</ToastContainer>
        </>
    );
}

export default Kezelok;