import { Button, Row, Col } from "react-bootstrap";
import { useState, useContext } from "react";
import InputMezo from "../kozos/InputMezo";
import { MegallokContext } from "../../context/Megallok/MegallokContext";
import _ from "lodash";
import { InfoPanelContext } from "../../context/Alap/InfoPanelContext";
import InfoPanel from "../kozos/InfoPanel";

/**
 * @module UjAllomas
 * @description Egy React komponens, amely lehetővé teszi egy új állomás hozzáadását egy adott vonalhoz,
 * hogy mi a következő állomás neve és mennyi idő alatt lehet eljutni oda.
 * @component
 * @param {Object} props - A komponens propsa.
 * @param {Array} props.pool - Azok a megállók, amik még nem szerepelnek az adott vonalon.
 * @param {string} props.irany - Az irány, amelyik vonalhoz hozzá akarjuk adni az új megállót.
 * @returns {React.Component} Egy React Bootstrap Row komponenst, amelyben egy új állomás hozzáadásához szükséges input mezők vannak.
 */
function UjAllomas({ pool, irany }) {
  const { megallok, setMegallok, checked, oppositeKey, megfordit } =
    useContext(MegallokContext);
  const { addInfoPanel } = useContext(InfoPanelContext);

  /**
   * @memberof UjAllomas
   * @description Egy useState hook, amely az új állomás adatait kezeli.
   * @type {Object} adatok - A jelenlegi állomás adatai.
   * @type {Function} setAdatok - Az állapot frissítésére szolgáló függvény.
   */
  const [adatok, setAdatok] = useState({ ...pool[0], ido: 1 });

  /**
   * @memberof UjAllomas
   * @function
   * @description Lementi az új állomást. Ha a szinkronizálás be van kapcsolva, akkor a másik irányú vonalhoz is hozzáadja az új állomást.
   * @param {Event} event - Egy esemény objektum.
   * @param {Object} obj - Egy objektum, amit menteni akarunk.
   * @param {Function} callback - Egy callback függvény, ami a következő input mezőt állítja be.
   * @param {Object} kovElem - A következő elem.
   */
  const handleSave = (event, obj, callback, kovElem) => {
    event.preventDefault();
    if (!obj.ido){
      addInfoPanel(<InfoPanel bg="danger" text="Nem megfelelő időtartam! Az idő 0 és 255 közötti egész szám lehet!"/>);
      return;
    }
    let tmp = {};
    tmp["allomas"] = obj["id"]
    tmp["hanyPerc"] = obj["ido"]
    tmp["elozoMegallo"] =
      megallok[irany].megallok[megallok[irany].megallok.length - 1].allomas;
    tmp["vonal"] = megallok[irany].megallok[0].vonal;

    setMegallok((prevMegallok) => ({
      ...prevMegallok,
      [irany]: {
        ...prevMegallok[irany],
        megallok: [...prevMegallok[irany].megallok, tmp],
      },

      ...(checked
        ? {
            [oppositeKey(irany)]: {
              ...prevMegallok[oppositeKey(irany)],
              megallok: megfordit([
                _.cloneDeep(tmp),
                ..._.cloneDeep(megallok[irany].megallok).reverse(),
              ]),
            },
          }
        : {}),
    }));
    if (kovElem) callback({ target: { name: "id", value: kovElem.id } });
  };

  /**
   * @memberof UjAllomas
   * @typedef {Object} Target
   * @property {string} name - A változtatni kívánt objektum kulcsa az `adatok` objektumban.
   * @property {any} value - Az új érték, amit be kell állítani.
   */

  /**
   * @function
   * @memberof UjAllomas
   * @description A változásokért felelős függvény
   * @param {Event} event - Egy esemény objektum.
   * @param {Target} event.target - Az esemény objektum célja.
   */
  const handleChange = ({ target }) => {
    const { name, value, min, max } = target;
    if (
      Number(value) % 1 !== 0 ||
      (min && Number(value) < Number(min)) ||
      (max && Number(value) > Number(max))
    )
      return
    setAdatok((values) => ({
      ...values,
      [name[0].toLowerCase() + name.slice(1)]: (value * 1),
    }));
  };

  /**
   * @function
   * @memberof UjAllomas
   * @description A következő elem.
   * Ha az első elemet választotta ki, a fejhasználó, akkor annak a következő elemét adja vissza.
   * @returns {Object} A következő elem, ami automatikusan kiválasztódik
   */
  const getKovSor = () =>
    adatok.id === pool[0]?.id ?? null ? pool[1] : pool[0];

  if (!pool || pool.length === 0) return null;

  return (
    <Row
      className="mb-3 mt-3 ps-lg-2 pe-lg-3 align-items-end"
      style={{ paddingLeft: "12px", paddingRight: "12px" }}
    >
      <div className="col-12 col-lg-4 p-0 ps-lg-1 pe-lg-2 mb-lg-0 mb-2" style={{textAlign:'left'}}>
      <span className="ms-1">Állomás:</span>
        <InputMezo
        as={Col}
        name="id"
        value="nev"
        pool={pool}
        isSelect={true}
        isSelectFirst={true}
        handleChange={handleChange}
      />
      </div>
      <div className="col-12 col-lg-4 p-0 ps-lg-1 pe-lg-2 mb-lg-0 mb-2" style={{textAlign:'left'}}>
      <span className="ms-1">Idő (perc):</span>
        <InputMezo
        
          as={Col}
          input={{ columnName: "ido", dataType: "tinyint" }}
          defaultValue={adatok.ido}
          handleChange={handleChange}
        />
      </div>

      <div className="col-12 col-lg-4 ps-0 ps-lg-2 pe-0 mb-lg-0 mb-2">
        <Button
          style={{ width: "100%" }}
          as={Col}
          variant="success"
          onClick={(event) =>
            handleSave(event, adatok, handleChange, getKovSor())
          }
        >
          Új állomás
        </Button>
      </div>
    </Row>
  );
}

export default UjAllomas;
