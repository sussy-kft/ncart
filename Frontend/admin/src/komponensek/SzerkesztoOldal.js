import Tabla from "./Tabla";
import React, { useContext } from "react";
import { InfoPanelContext } from "../context/InfoPanelContext";
import { Form, ToastContainer } from "react-bootstrap";
import FormMezo from "./FormMezo";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MetaadatContext } from "../context/MetaadatContext";
import Auth from "../Auth";
import { useRef } from "react";

function Kezelok(props) {
  const { InfoPanels } = useContext(InfoPanelContext);
  const { setUrl } = useContext(MetaadatContext);

  const location = useLocation();

  useEffect(() => {
    setUrl(location.pathname.split("admin/")[1]);
  }, [location.pathname]);

  return (
    <>
      {props.child ?? (
        <>
          <FormMezo />
          <h1>{props.cim}</h1>
          <Tabla />
        </>
      )}
      <ToastContainer position="top-end" className="position-fixed">
        {InfoPanels}
      </ToastContainer>
    </>
  );
}

export default Kezelok;

