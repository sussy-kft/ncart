import React, { useState, useEffect, useContext } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import InputMezo from "../kozos/InputMezo";
import { AxiosContext } from "../../context/Alap/AxiosContext";
import { MetaadatContext } from "../../context/Alap/MetaadatContext";
import { MegallokContext } from "../../context/Megallok/MegallokContext";

/**
 * @module VonalSzuro
 * @description A `VonalSzuro` egy React komponens, ami egy csoport select inputot jelenít meg, hogy a felhasználó kiválaszthassa, hogy melyik vonalat akarja szerkeszteni.
 * Az adatokat a megadott URL-ekről tölti be és a select inputokat a betöltött adatokkal tölti fel.
 *
 * @param {Array} pool - Egy objektum lista, ami az input mezőkhöz tartozó metaadatokat tartalmazza.
 * @param {Function} setMeta - Egy callback függvény, ami az oda/vissza vonal adatait állítja be.
 *
 * @returns {JSX.Element} Egy csoport select inputot, ami a vonalszámot és a járműtípust alapján lehet kiválasztani.
 */
function VonalSzuro({ pool, setMeta }) {
  const { axiosId, errorState, getAll } = useContext(AxiosContext);
  const { url, findKey, kulsoAdatok } = useContext(MetaadatContext);
  const { setMindketto } = useContext(MegallokContext);

  const [adatok, setAdatok] = useState(null);
  const [opciok, setOpciok] = useState(null);

  /**
   * @memberof VonalSzuro
   * @typedef {Object} Target
   * @property {string} name -  Ez határozza meg az `adatok` objektum kulcsát.
   * @property {any} value - Ez az érték lesz beállítva az `adatok` objektum kulcsához.
   */

  /**
   * 
   * @description A select input mezők értékeinek változását kezeli.
   * @memberof VonalSzuro
   * @param {Object} event - Egér esemény objektum.
   * @param {Target} event.target - Az esemény célja.
   */
  const handleChange = ({ target }) => {
    const { name, value } = target;
    setAdatok((elozoAdatok) => ({
      ...elozoAdatok,
      [name[0].toLowerCase() + name.slice(1)]: value,
    }));
  };

  /**
   * @memberof VonalSzuro
   * @name useEffect_setMindketto
   * @description Ez a useEffect hook felelős az `adatok` állapot változásainak kezeléséért.
   * Kezdetben null értékkel hívja meg a `setMindketto` függvényt.
   * Ha az `adatok` nem null, akkor egy GET kérést indít a `vonalak/megallok/` végpontra, amelyhez hozzáfűzi az `adatok` kulcsait, "/" jellel összekötve.
   * Ha a GET kérés sikeres, akkor átadja a választ a `setMindketto`-nek.
   * Ha a GET kérés sikertelen, a `setMindketto` függvényt egy olyan objektummal hívják meg, amelyben az `oda` és `vissza` kulcsok mindkettő null-ra vannak állítva.
   * (A vissza adat nem fontos, csak a megjelenítéshez kell.)
   * Végül a `setMeta` callback függvénynek átadja az `adatok`-at.
   * Ez a hook minden `adatok` állapotváltozásnál lefut.
   */

  useEffect(() => {
    setMindketto(null);
    if (adatok) {
      getAll(
        `vonalak/megallok/${pool.map((input) => adatok[input.key]).join("/")}`,
        setMindketto,
        () => {
          setMindketto({ oda: null, vissza: null });
          setMeta({ ...adatok });
        }
      );
    }
  }, [adatok]);

  /**
   * @memberof VonalSzuro
   * @name useEffect_setOpciok
   * @description Ez az useEffect hook felelős az adatok lekérdezéséért és az `opciok` állapot beállításáért.
   * Először végrehajtja az összes GET kérést, ami a `pool` tömbben lévő URL-nek a segítségével határozza meg a végpontot.
   * Ezután beállítja az `opciok` objektumot a lekérdezett adatok segítségével.
   * A `pool`-ban lévő URL-eket az `opciok` objektum kulcsaként használja, az érték pedig egy egyedi elemekből álló tömb.
   * Az elemek egyediségét egy Map biztosítja, ahol minden kulcs-érték pár csak egyszer szerepel az elemek között.
   * Ez azért fontos, mert a válaszokban lehetnek olyan elemek, amelyek azonosak, de csak egyet szeretnénk megjeleníteni.
   */
  useEffect(() => {
    (async () => {
      const data = await Promise.all(pool.map(({ url }) => getAll(url)));

      setOpciok(
        pool.reduce((acc, { url, key }, index) => {
          acc[url] = Array.from(
            new Map(data[index].map((item) => [item[key], item])).values()
          );
          return acc;
        }, {})
      );
    })();
  }, [url, axiosId]);

  if (!kulsoAdatok && !opciok) {
    return <img src={`https://http.cat/${errorState ? 503 : 102}`} />;
  }

  return pool.map(({ value, label, key, url }) => (
    <Form.Group key={value} as={Col} md="6">
      <Form.Label>{label}: </Form.Label>
      {opciok && (
        <InputMezo
          key={key}
          name={key}
          input={findKey(key)}
          value={value}
          idk={true}
          handleChange={handleChange}
          isSelect={true}
          pool={opciok[url]}
        />
      )}
    </Form.Group>
  ));
}

export default VonalSzuro;
