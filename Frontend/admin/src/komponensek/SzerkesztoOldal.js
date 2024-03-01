import Lekerdezes from "./Lekerdezes";
import React, { useContext } from 'react';
import { InfoPanelContext } from '../context/InfoPanelContext';
import { ToastContainer } from 'react-bootstrap';
import InputMezo from "./InputMezo";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { MetaadatContext } from "../context/MetaadatContext";

function Kezelok(props)
{   
    const {InfoPanels} = useContext(InfoPanelContext)
    const {setUrl} = useContext(MetaadatContext)

    const location = useLocation();

    useEffect(() => {
        setUrl(location.pathname.substring(1))
        console.log(location.pathname);
    }, [location]);

    return (
        <>
            <InputMezo></InputMezo>
            <h1>{props.cim}</h1>
            <Lekerdezes/>
            <ToastContainer position="top-end" className="position-fixed">{InfoPanels}</ToastContainer>
        </>
    );
}

export default Kezelok;