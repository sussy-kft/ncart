import React, { useState, useContext, useCallback } from "react";
import Button from "react-bootstrap/Button";
import InputMezo from "../kozos/InputMezo";
import { AxiosContext } from "../../context/Alap/AxiosContext";
import { MetaadatContext } from "../../context/Alap/MetaadatContext";
import _ from "lodash";

/**
 *
 * @component
 * @description Egy sor komponens, ami egy táblázatban jelenik meg.
 * @module Sor
 * @param {Object} props - A komponens propsai.
 * @param {Object} props.row - Az adott sor adatai.
 * @param {Function} props.callback - Egy callback függvény, ami a törlés során hívódik meg.
 * @param {number} props.ix - Az adot sor indexe. Ez azért fontos, mert a React key ez alapján különbözteti meg a sorokat.
 *
 * @returns {React.Element} Egy táblázat sorát adja vissza.
 *
 * @example
 * <Sor row={row} callback={callback} ix={ix} />
 */
function Sor({ row, ix, callback }) {
  const { patch } = useContext(AxiosContext);
  const { url, findKey, getPKs, kulsoAdatok } = useContext(MetaadatContext);

  const [isAdatUpdate, setIsAdatUpdate] = useState(false);
  const [adatok, setAdatok] = useState(_.cloneDeep(row));
  const regiAdatok = _.cloneDeep(row);

  /**
   * @description Egy rekurzív függvény, ami egy objektumban megkeresi a kulcsot.
   * @memberof Sor
   * @function
   * @param {Object} obj - Az objektum, amiben keresni kell.
   * @param {string} key - A kulcs, amit meg kell keresni.
   * @param {string} [path=""] - Az útvonal, amit a rekurzió során felépít. Ezt a paramétert nem kell megadni, csak a rekurziónak kell.
   *
   * @returns {string} Az útvonal, ahol a kulcs megtalálható.
   */
  const melyKereses = (obj, key, path = "") => {
    for (let k in obj) {
      if (k === key) return path + k;
      if (typeof obj[k] === "object") {
        const res = melyKereses(obj[k], key, path + k + ".");
        if (res) return res;
      }
    }
  };

  /**
   * @typedef {Object} Target
   * @memberof Sor
   * @property {string} name - Az input mező neve.
   * @property {string} type - Az input mező típusa.
   * @property {boolean} checked -  A checkbox értéke, hogy be van-e pipálva.
   * @property {string} value - Az input mező értéke.
   */

  /**
   * A változásokért felelős függvény.
   * @memberof Sor
   * @param {Event} event - Esemény objektum.
   * @param {Target} event.target - Az esemény célja.
   * @function
   */
  const handleChange = ({ target }) => {
    const { name, type, checked, value } = target;
    let obj = _.cloneDeep(adatok);

    if (type === "checkbox") {
      const engedelyek = adatok[name[0].toLowerCase() + name.slice(1)] ?? [];
      if (checked) engedelyek.push(value);
      else engedelyek.splice(engedelyek.indexOf(value), 1);
      obj[name[0].toLowerCase() + name.slice(1)] = engedelyek;
    } else
      obj = _.set(
        obj,
        melyKereses(obj, name[0].toLowerCase() + name.slice(1)),
        value
      );
    setAdatok(obj);
  };

  /**
   * @description Az elsődleges kulcsokat adja vissza, "/" jellel összekötve.
   * @memberof Sor
   * @function
   * @returns {string} Úgy adja vissza az elsődleges kulcsokat, hogy a végponthoz hozzáadja a megfelelő értékeket.
   */
  const getPKadat = () => {
    return getPKs()
      .map((value) => adatok[value[0].toLowerCase() + value.slice(1)])
      .join("/");
  };

  /**
   *
   * @function
   * @description Visszaállítja az adatokat a kezdeti értékekre.
   * @memberof Sor
   */
  const reset = () => {
    setAdatok(regiAdatok);
    setIsAdatUpdate(false);
  };

  /**
   * @description Egy rekurzív függvény, ami az adatokat megjeleníti cellákban. (nested objektmokkal is működik)
   * Először rendezi az objektumokat a `columnIndex` alapján, majd csak azután kezdi megjeleníteni az értékeket.
   * Ellenőrzi, hogy az adott mező rejtett-e, ha igen, akkor nem jeleníti meg.
   * Ha az adott mező referencia mezője egy lista, akkor egy checkbox listát jelenít meg.
   * @memberof Sor
   * @function
   * @param {Object} elem - Az elem, amiből cella adatot kell generálni.
   * @param {Function} cellaLista - Egy függvény, amit akkor hív meg, ha az adott `elem` referenciája egy lista.
   * @param {Function} cellaTartalom - Egy függvény, amit alapértelmezetten hív meg.
   *
   * @returns {Array} A legenerált cella lista.
   */
  const CellaGeneralo = (elem, cellaLista, cellaTartalom) =>
    Object.entries(elem)
      .sort(([keyA], [keyB]) => {
        const metaA = findKey(keyA) ?? { columnIndex: 0 };
        const metaB = findKey(keyB) ?? { columnIndex: 0 };
        return metaA.columnIndex - metaB.columnIndex;
      })
      .flatMap(([key, value]) => {
        const metainfo = findKey(key);
        if (metainfo?.isHidden) return [];
        if (metainfo?.references?.split("/").length > 1)
          return cellaLista(value, key, metainfo);
        if (getPKs().includes(key))
          return (
            <td key={key}>
              <p>{value}</p>
            </td>
          );
        if (typeof value === "object")
          return CellaGeneralo(value, cellaLista, cellaTartalom);
        return cellaTartalom(key, value, metainfo);
      });

  /**
   * @description Egy függvény, ahhoz az állapothoz, hogy a felhasználó csak olvassa az adatokat.
   * @memberof Sor
   * @function
   * @param {Object} elem - Az elem, amiből cella adatot kell generálni.
   *
   * @returns {Array} A generált cella elemek listája.
   */
  const cellaElem = (elem) => {
    const cellaLista = (value, key, metainfo) =>
      kulsoAdatok[metainfo.references].map((opcio) => (
        <td key={opcio}>{value.includes(opcio) ? "✔️" : "❌"}</td>
      ));
    const cellaTartalom = (key, value) => <td key={key}>{value}</td>;
    return CellaGeneralo(elem, cellaLista, cellaTartalom);
  };

  /**
   * @description Egy függvény, ahhoz az állapothoz, hogy a felhasználó módosítja-e az adatokat, generál input cellákat.
   *
   * @function
   * @param {Object} elem - Az elem, amiből cella adatot kell generálni.
   * @memberof Sor
   * @returns {Array} A generált input cellák.
   */
  const inputCella = (elem) => {
    const cellaLista = (value, key, metainfo) =>
      kulsoAdatok[metainfo.references].map((opcio, index) => (
        <td key={index}>
          <InputMezo
            key={index}
            input={metainfo}
            value={opcio}
            handleChange={handleChange}
            checked={value.includes(opcio)}
            pool={[opcio]}
            flag={false}
          />
        </td>
      ));
    const cellaTartalom = (key, value, metainfo) => (
      <td key={key}>
        <InputMezo
          key={key}
          input={metainfo}
          defaultValue={value}
          value={value}
          handleChange={handleChange}
        />
      </td>
    );

    return CellaGeneralo(elem, cellaLista, cellaTartalom);
  };

  /**
   * @function
   * @memberof Sor
   * @description Egy függvény, ami a gombokat generálja.
   * Mivel egy sornak két állapota van, ezért eldönti, hogy a felhasználó jelenleg szerkeszti-e az adott sort.
   * Az első állapot, hogy a felhasználó módosítja az adatokat, ekkor a gombok a küldés és a mégse gombok lesznek. Ekkor a küldés gomb a patch metódust hívja meg, vagy a mégse gomb visszaállítja az adatokat.
   * A második állapotban a felhasználó csak módosítani szeretné az adatokat, ekkor a módosítás és a törlés gombok lesznek. Ekkor a módosítás gomb a sorok szerkesztését engedélyezi, vagy a törlés gomb hívja meg a callback függvényt.
   * @returns {JSX.Element} A generált gombok.
   */
  const gombGeneral = () => {
    const { variant, onClick, text, dangerOnClick, dangerText } = isAdatUpdate
      ? {
          ...{
            variant: "success",
            onClick: () => patch(url, getPKadat(), adatok),
            text: "Küldés",
            dangerOnClick: reset,
            dangerText: "Mégse",
          },
        }
      : {
          ...{
            variant: "primary",
            onClick: () => setIsAdatUpdate(true),
            text: "Módosítás",
            dangerOnClick: () => callback(adatok),
            dangerText: "Törlés",
          },
        };
    return (
      <>
        {getPKs().length !== Object.keys(row).length && (
          <td key="editButton">
            <Button variant={variant} onClick={onClick}>
              {text}
            </Button>
          </td>
        )}
        <td key="deleteButton">
          <Button key="danger" variant="danger" onClick={dangerOnClick}>
            {dangerText}
          </Button>
        </td>
      </>
    );
  };

  if (!adatok) return null;

  return (
    <tr key={ix}>
      {isAdatUpdate ? inputCella(adatok) : cellaElem(adatok)}
      {gombGeneral()}
    </tr>
  );
}
export default Sor;
