import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Table from "react-bootstrap/Table";
import PopUpPanel from "./PopUpPanel";
import { AxiosContext } from "../context/AxiosContext";
import { MetaadatContext } from "../context/MetaadatContext";
import Sor from "./Sor";

/**
 * Egy React komponens, ami egy táblázatot jelenít meg adatokkal, amiket az URL-ből állapítja meg, hogy honnan kell lekérni.
 *
 * @returns {JSX.Element} Egy táblázatot ad vissza adatokkal, vagy egy képet, ami a hibás vagy betöltés állapotot jelzi.
 */
function Tabla() {
  const { axiosId, errorState, getAll } = useContext(AxiosContext);
  const { url, getPKs, findKey, kulsoAdatok } = useContext(MetaadatContext);

  const [show, setShow] = useState(false);
  const [id, setId] = useState(null);
  const [adatok, setAdatok] = useState(null);

  /**
   * Egy callback függvény, ami az adat egyedi útvonalát álapítja meg és megjeleníti a popupot.
   * Az `useCallback`-et használja, hogy elkerülje a felesleges újra rendereléseket.
   *
   * @param {Object.<string, *>} row - Az adott sor adatai.
   */
  const adatUtvonal = useCallback(
    (row) => {
      const id = getPKs()
        .map((value) => row[value[0].toLowerCase() + value.slice(1)])
        .join("/");
      setId(id);
      setShow(true);
    },
    [getPKs]
  );

  /**
   * Egy hook, ami lekéri az új adatokat, amikor az `url` vagy az `axiosId` megváltozik.
   * Az `adatok` állapotot `null`-ra állítja, mielőtt új adatokat kérne le, hogy ne jelenjenek meg a régi adatok, miközben lekéri az új adatokat.
   */
  useEffect(() => {
    setAdatok(null);
    if (url) getAll(url, setAdatok);
  }, [url, axiosId]);

  const fejlecElemRef = useRef();
  fejlecElemRef.current = (elem) =>
    Object.keys(elem).map((key) => {
      if (Array.isArray(elem[key]))
        return kulsoAdatok[findKey(key).references].map((opcio, index) => {
          return <th key={index}>{opcio}</th>;
        });
      if (findKey(key)?.isHidden) return null;
      if (typeof elem[key] !== "object") return <th key={key}>{key}</th>;
      return fejlecElemRef.current(elem[key]);
    });

  /**
   * Egy rekúrzív függvény, ami a táblázat fejlécét generálja az `elem` objektum kulcsai alapján.
   * `useRef`-et és `useCallback`-et hookokat használ, hogy biztosítsa, hogy a függvény mindig a legfrissebb verzióját hívja meg.
   * Azért van szükség a `useCallback`-re, hogy elkerülje a függvény felesleges számolásokat, amikor a függvény függőségei (`findKey`, `kulsoAdatok`) nem változnak.
   * A `useRef`-et azért használja, hogy a függvény mindig a legfrissebb verzióját hívja meg, mivel a függvény rekurzív, előfordulhat, hogy közben a függőség frissül, emiatt az `useCallback` nem a megfelelő verziót hívná meg.
   *
   * @param {Object.<string, *>} elem - Egy objektumot, aminek az összes adattagját meg akarunk jeleníteni a fejécben.
   * Továbbá alkalmas a mély objektumok feldolgozására is.
   * @returns {JSX.Element[] | null} Egy tömböt ad vissza a táblázat fejléc elemeivel.
   */
  const fejlecElem = useCallback(fejlecElemRef.current, [findKey, kulsoAdatok]);

  if (!adatok || !getPKs() || !kulsoAdatok)
    return errorState ? (
      <img src="https://http.cat/503" alt="Error 503" />
    ) : (
      <img src="https://http.cat/102" alt="Betöltés..." />
    );

  return (
    adatok.length === 0 
    ? <h5>Még nincs rekord az adatbázisban.</h5>
    :<>
      <Table striped bordered hover>
        <thead>
          <tr>
            {fejlecElem(adatok[0])}
            {getPKs().length !== Object.keys(adatok[0]).length && (
              <th>Módosítás</th>
            )}
            <th>Törlés</th>
          </tr>
        </thead>
        <tbody>
          {adatok.map((row, ix) => {
            let adat = {};

            for (const key in row)
              adat[key] = !findKey(key)?.isHidden ? row[key] : null;

            return <Sor key={ix} row={adat} callback={adatUtvonal} />;
          })}
        </tbody>
      </Table>
      <PopUpPanel show={show} handleClose={() => setShow(false)} id={id} />
    </>
  );
}

export default Tabla;
