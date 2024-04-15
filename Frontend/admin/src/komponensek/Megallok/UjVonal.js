import React, { useEffect, useState, useContext } from "react";
import { AxiosContext } from "../../context/AxiosContext";
import Col from "react-bootstrap/Col";
import InputMezo from "../InputMezo";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { MegallokContext } from "./MegallokContext";

/**
 * `UjVonal` egy React komponens, amely egy új vonal létrehozására szolgál, ha még nincs oda/vissza vonal.
 * Ez a komponens nagyban segíti a felhasználókat, hogy könnyen hozzáadhassanak egy új vonalat a rendszerhez, így nem kell a `Vonalak` nevű oldalon létrehozni, ha esetleg nincs még oda/vissza vonal.
 *
 * @component
 * @param {Object} masikVonal - Egy objektum, amely információkat tartalmaz egy másik vonalról. Ez a POST kérésben segít, hogy az azonos információkat használja fel.
 * @param {Object} meta - Egy objektum, amely meta információkat tartalmaz, ha esetleg nincs még oda/vissza vonal.
 * @param {string} name - Az útvaonal íránya. ("oda" vagy "vissza" lehet)
 *
 * @returns {React.Element} A React element that represents a form for creating a new line.
 */
function UjVonal({ masikVonal, meta, name }) {
  const { getAll, post } = useContext(AxiosContext);
  const { setMegallok } = useContext(MegallokContext);
  const { setRegiMegallok } = useContext(MegallokContext);

  /**
   * @typedef {Object} adatok
   * @property {string} vonalSzam - A vonal ID-ja.
   * @property {string} jarmuTipus - A járműtípus külső kulcsa.
   */
  const [adatok, setAdatok] = useState({
    vonalSzam: masikVonal?.vonalSzam ?? meta.vonalSzam,
    jarmuTipus: masikVonal?.jarmuTipus ?? meta.id,
  });

  const [opciok, setOpciok] = useState(null);

  /**
   * @typedef {Object[]} metainfo
   * @property {string} cim - Az oldalon megjelenő cím az input mező előtt.
   * @property {string} name - Az ojektum kulcsa, amit a változásokkor módosítunk.
   */
  const metainfo = [
    {
      cim : "Kezdőállomás:",
      name: "kezdoAll"
    },
    {
      cim: "Végállomás:",
      name: "vegall"
    }
  ]

  /**
   * Lekéri az összes állomást és beállítja az `opciok` állapotot.
   */
  useEffect(() => {
    getAll("allomasok", setOpciok);
  }, []);

  /**
   * Az adatok változását kezelő függvény.
   *
   * @param {string} customName - A kulcs, ami megmondja, hogy melyik adatot kell változtatni.
   * @param {Event} event - Esemény objektum.
   */
  const handleChange = (customName, event) => {
    setAdatok((values) => ({ ...values, [customName]: event.target.value }));
  };

  /**
   * Egy új vonal létrehozásához küld egy POST kérést.
   * Amikor a válasz megérkezik, újra beállítja a `megallok` és a `regiMegallok` állapotokat.
   */
  const kuldes = async () => {
    const valasz = await post("vonalak", adatok);
    // rip sussy code
    setMegallok(valasz);
    setRegiMegallok(valasz);
  };

  /**
   * Egy `div` elemet generál egy `InputMezo` és `Form.Label` komponensekkel.
   *
   * @param {string} label - A `Form.Label` komponens szövege.
   * @param {string} customName - Amikor az `InputMezo` komponensben változik az érték, akkor ezzel a kulccsal állapítjuk meg, hogy melyik adatot kell módosítani az `adatok`-ban.
   * @returns {JSX.Element} Egy div elem, ami tartalmazza a `Form.Label` és az `InputMezo` komponenseket.
   */
  const generateInputMezo = (label, customName) => (
    <div className="row mb-2">
      <Form.Label className="col-12 col-md-auto" style={{textAlign: 'left', width: "130px"}} as={Col}>{label}</Form.Label>
      <div className="col-12 col-md">
        <InputMezo
          name="id"
          value="nev"
          pool={opciok}
          isSelect={true}
          idk={true}
          handleChange={event => handleChange(customName, event)}
        />
      </div>
    </div>
  );

  if (!opciok) return null;

  return (
    <div>
      <h3>Nincs még {name} vezető útvonal</h3>
      <br />
      <h4>Új {name} útvonal hozzáadása:</h4>
      {metainfo.map(elem => generateInputMezo(elem.cim, elem.name))}
      <Button
        className="mt-2"
        as={Col}
        variant="success"
        onClick={kuldes}
      >
        Új {name} útvonal
      </Button>
    </div>
  );
}

export default UjVonal;
