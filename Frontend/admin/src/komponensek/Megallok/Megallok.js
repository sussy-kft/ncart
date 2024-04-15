import React from "react";
import VonalSzuro from "./VonalSzuro";
import { Form, Row } from "react-bootstrap";
import MegalloOldal from "./MegalloOldal";
import { MegallokProvider } from "./MegallokContext";

/**
 * A fő Megállók komponens, ami a VonalSzűrőt és a MegállóOldalt tartalmazza.
 *
 * @component
 * @param {string} cim - Az oldal címe.
 * @returns {JSX.Element} A megjeélítendő komponens.
 */
function Megallok({ cim }) {

  /**
   * A meta egy segédobjektum, ami akkor kell ha esetlegesen még nem létezik az oda és a visza.
   * Olyan információkat tartalmaz, mint a vonalSzám és a járműtípus. 
   */
  const [meta, setMeta] = React.useState(null);

  /**
   * Metainfo, hogy a Vonalszűrőnek hogyan kell kezelnie az adatokat.
   * 
   * @property {string} url - Az URL, ahonnan az adatokat le kell kérni.
   * @property {string} key - Megmondja, hogy melyik kulcsnak kell az {@link InputMezo} name értékének lennie.
   * @property {string} value - Megmondja, hogy melyik kulcsnakk kell az {@link InputMezo} value értékének lennie.
   * @property {string} label - A megjelenítendő szöveg az oldalon.
   */
  const pool = [
    {
      url: "vonalak",
      key: "vonalSzam",
      value: "vonalSzam",
      label: "Vonalszám",
    },
    {
      url: "jarmutipusok",
      key: "id",
      value: "megnevezes",
      label: "Járműtípus",
    },
  ];

  return (
    <MegallokProvider>
      <h1>{cim}</h1>
      <Form className="container">
        <Row>
          <VonalSzuro
            pool={pool}
            setMeta={setMeta}
          />
        </Row>
      </Form>
      <MegalloOldal meta={meta} />
    </MegallokProvider>
  );
}

export default Megallok;
