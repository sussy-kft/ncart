import Tabla from "./Tabla";
import React, { useEffect, useContext } from "react";
import { InfoPanelContext } from "../context/InfoPanelContext";
import { ToastContainer } from "react-bootstrap";
import FormMezo from "./FormMezo";
import { useLocation } from "react-router-dom";
import { MetaadatContext } from "../context/MetaadatContext";

/**
 * @typedef {Object} AlapKomponensProps
 * @property {string} cim - Cím, ami megjelenik az oldalon.
 */

/**
 * Ez az alapértelmezett komponens, ami {@link FormMezo}t, egy címet és egy {@link Tabla}t jelenít meg.
 *
 * @param {AlapKomponensProps} cim - Cím, ami megjelenik az oldalon.
 *
 * @returns {React.Element} Az `AlapKomponens`t.
 */
const AlapKomponens = ({ cim }) => (
  <>
    <FormMezo />
    <h1>{cim}</h1>
    <Tabla />
  </>
);

/**
 * Egy komponens, ami egy gyerek komponenst jelenít meg, ha létezik, különben egy alapértelmezett megjelenítést jelenít meg.
 * Beállítja az URL-t a {@link MetaadatContext}ben a jelenlegi elérési út alapján.
 * Továbbá megjeleníti a `ToastContainer`t, ami az {@link InfoPanelContext}ből származó `InfoPanel`eket megjeleníti a jobb felső sarokban.
 * 
 * @param {React.ReactNode|null} props.child - Egy gyerek komponens, ami arra szolgál, hogy ha egyedi megjelenítést szeretnénk az oldalon, akkor ezt jeleníti meg. Ha nincs, akkor egy alapértelmezett komponenst jelenít meg.
 *
 * @param {string} props.cim - Az oldal címe, ami megjelenik az oldalon.
 *
 * @returns {React.Element} A gyerek komponenst adja vissza, ha létezik, különben egy {@link AlapKomponens} ad vissza.
 */
function SzerkesztoOldal({ child = <AlapKomponens />, cim }) {
  const { InfoPanels } = useContext(InfoPanelContext);
  const { setUrl } = useContext(MetaadatContext);

  const location = useLocation();

  useEffect(() => {
    setUrl(location.pathname.split("admin/")[1]);
  }, [location.pathname]);

  return (
    <>
      {React.cloneElement(child, { cim })}
      <ToastContainer position="top-end" className="position-fixed">
        {InfoPanels}
      </ToastContainer>
    </>
  );
}

export default SzerkesztoOldal;
