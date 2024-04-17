import { Button, Row, Col } from "react-bootstrap";
import { useState, useContext } from "react";
import InputMezo from "../InputMezo";
import { MegallokContext } from "./MegallokContext";
import _ from "lodash";
/**
 * @param {Array} pool - Azok a megállók, amik még nem szerepelnek az adott vonalon.
 * @param {string} irany - Az irány, amelyik vonalhoz hozzá akarjuk adni az új megállót.
 * @returns {React.Component} `UjAllomas` komponenst
 */
function UjAllomas({ pool, irany }) {
  const { megallok, setMegallok, checked, oppositeKey, megfordit } =
    useContext(MegallokContext);

  /**
   * Az új állomás adatai
   * @type {[Object, Function]}
   */
  const [adatok, setAdatok] = useState({ ...pool[0], ido: 1 });

  /**
   * A lokális megállók mentését kezeli.
   *
   * @param {Event} event - Egy esemény objektum.
   * @param {Object} obj - Egy objektum, amit menteni akarunk.
   * @param {Function} callback - Egy callback függvény, ami a következő input mezőt állítja be.
   * @param {Object} kovElem - A következő elem.
   */
  const handleSave = (event, obj, callback, kovElem) => {
    event.preventDefault();
    let tmp = {};
    tmp["allomas"] = obj["id"] * 1;
    tmp["hanyPerc"] = obj["ido"] * 1;
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
   * A változásokért felelős függvény
   * @param {Object} event - Egy esemény objektum.
   * @param {Object} event.target.name - A változtatni kívánt objektum kulcsa az `adatok` objektumban.
   * @param {Object} event.target.value - Az új érték, amit be kell állítani.
   */
  const handleChange = ({ target: { name, value } }) => {
    setAdatok((values) => ({
      ...values,
      [name[0].toLowerCase() + name.slice(1)]: value,
    }));
  };

  /**
   * A következő elem.
   * Ha az első elemet választotta ki, a fejhasználó, akkor annak a következő elemét adja vissza.
   * @returns {Object} A következő elem, ami automatikusan kiválasztódik
   */
  const getKovSor = () =>
    adatok.id === pool[0]?.id ?? null ? pool[1] : pool[0];

  if (!pool || pool.length === 0) return null;

  return (
    <Row className="mb-3 mt-3">
      <InputMezo
        as={Col}
        name="id"
        value="nev"
        pool={pool}
        isSelect={true}
        idk={true}
        handleChange={handleChange}
      />
      <InputMezo
        as={Col}
        input={{ columnName: "ido", dataType: "tinyint" }}
        value="1"
        handleChange={handleChange}
      />
      <Button
        as={Col}
        variant="success"
        onClick={(event) =>
          handleSave(event, adatok, handleChange, getKovSor())
        }
        style={{ marginRight: "12px" }}
      >
        Új állomás
      </Button>
    </Row>
  );
}

export default UjAllomas;
