import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import NoPage from "./NoPage";
import UdvozloOldal from "./UdvozloOldal";
import SzerkesztoOldal from "./SzerkesztoOldal";
import MegalloOdlal from "./MegalloOldal";
import Auth from "../../../HOC/Auth";
import Documentacio from "./DocumentacioOldal";

/**
 * @memberof Admin
 * @inner
 * @typedef {Object} Utvonal
 * @property {string} key - Egy egyedi kulcs a komponensekhez. Egyben ez mutatja az útvonalat is.
 * @property {string} cim - Az oldalon megjelenő cím.
 * @property {React.Component} [child] - Ez a komponens jelenik meg az oldalon. Ha nincs megadva, akkor a SzerkesztoOldal alapértelmezett komponense jelenik meg.
 */

/**
 * @memberof Admin
 * @inner
 * @name utvonalak
 * @type {Utvonal[]}
 * @description Az Admin oldal útvonalait tartalmazó tömb.
 */
const utvonalak = [
  { key: "kezelok", cim: "Kezelők" },
  { key: "jarmutipusok", cim: "Járműtípusok" },
  { key: "vonalak", cim: "Vonalak" },
  { key: "allomasok", cim: "Állomások" },
  { key: "inditasok", cim: "Indítások" },
  { key: "megallok", cim: "Megállok", child: <MegalloOdlal /> },
];

/**
 * @module Admin
 * @description Az Admin komponens feladata, hogy a további útvonalakak megjelenítését kezelje.
 * @returns {React.Component} Az Admin komponenst.
 */
function Admin() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
      <Route index element={<UdvozloOldal />} /> 
      <Route path="dokumentacio" element={<Documentacio />} />
        {utvonalak.map((route) => (
          <Route
            key={route.key}
            path={route.key}
            element={<SzerkesztoOldal cim={route.cim} child={route.child} />}
          />
        ))}
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  );
}

export default Auth(Admin);
