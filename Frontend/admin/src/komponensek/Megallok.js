import React, { useContext } from 'react';
import { InfoPanelContext } from '../context/InfoPanelContext';
import { ToastContainer } from 'react-bootstrap';

function Megallok()
{
    const {InfoPanels} = useContext(InfoPanelContext);

    return (
        <>
            <div>Megállok</div>
            <div>Nincs út</div>
            <ToastContainer position="top-end" className="position-fixed">{InfoPanels}</ToastContainer>
        </>
    );
}

export default Megallok;