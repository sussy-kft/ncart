import React, { useState, useContext, useCallback } from "react";
import Button from "react-bootstrap/Button";
import InputMezo from "./InputMezo";
import { AxiosContext } from "../context/AxiosContext";
import { MetaadatContext } from "../context/MetaadatContext";
import _ from "lodash";

/**
 *
 * @component
 * @param {Object} row - Az adott sor adatai.
 * @param {Function} callback - Egy callback függvény, ami a törlés során hívódik meg.
 * @param {number} ix - Az adot sor indexe. Ez azért fontos, mert a React key alapján különbözteti meg a sorokat.
 *
 * @returns {React.Element} A sor komponenst.
 *
 * @example
 * <Sor row={row} callback={callback} ix={ix} />
 */
function Sor({row , ix, callback}) {
  const { patch } = useContext(AxiosContext);
  const { url, findKey, getPKs, kulsoAdatok } = useContext(MetaadatContext);

  const [isAdatUpdate, setIsAdatUpdate] = useState(false);
  const [adatok, setAdatok] = useState(_.cloneDeep(row));
  const regiAdatok = _.cloneDeep(row);

  /**
   * Egy rekurzív függvény, ami egy objektumban megkeresi a kulcsot.
   *
   * @param {Object} obj - Az objektum, amiben keresni kell.
   * @param {string} key - A kulcs, amit meg kell keresni.
   * @param {string} [path=""] - Az útvonal, amit a rekurzió során felépít. Ezt a paraméterent nem kell megadni, csak a rekurziónak kell.
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
   * Handle change event from input fields.
   *
   * @param {Object} event - Esemény objektum.
   * @param {string} event.target.name - Az input mező neve.
   * @param {string} event.target.type - Az input mező típusa.
   * @param {boolean} event.target.checked - A checkbox értéke, hogy be van-e pipálva.
   * @param {string} event.target.value - Az input mező értéke.
   */
  const handleChange = ({target: { name, type, checked, value }} ) => {
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
   * @returns {string} Úgy adja vissza az elsődleges kulcsokat, hogy a végponthoz hozzáadja a megfelelő értékeket.
   */
  const getPKadat = () => {
    return getPKs()
      .map((value) => adatok[value[0].toLowerCase() + value.slice(1)])
      .join("/");
  };

  /**
   * Visszaállítja az adatokat a kezdeti értékekre.
   */
  const reset = () => {
    setAdatok(regiAdatok);
    setIsAdatUpdate(false);
  };

  /**
   * Egy rekurzív függvény, ami az objektumban mélyen elhelyezkedő értékeket is megjeleníti.
   * Mivel a {@link row}-ban is lehet több beágyazott objektum, ezért megkeresi az összeset és azokat is megjeleníti egy cellában.
   *
   * @param {Object} elem - Az elem, amiből cella adatot kell generálni.
   * @param {Function} cellaLista - Egy függvény, amit akkor hív meg, ha az adot `elem` egy lista.
   * @param {Function} cellaTartalom - Egy függvény, amit alapértelmezetten hív meg.
   *  Function to generate content cell data.
   *
   * @returns {Array} A legenerált cella lista.
   */
  const CellaGeneralo = (elem, cellaLista, cellaTartalom) =>
    Object.entries(elem).flatMap(([key, value]) => {
      const metainfo = findKey(key);
      if (metainfo?.isHidden) return [];
      if (metainfo?.references?.split("/").length > 1)
        return cellaLista(value, key, metainfo);
      if (getPKs().includes(key))
        return (
          <td>
            <p>{value}</p>
          </td>
        );
      if (typeof value === "object")
        return CellaGeneralo(value, cellaLista, cellaTartalom);
      return cellaTartalom(key, value, metainfo);
    });

  /**
   * Egy függvény, ahhoz az állapothoz, hogy a felhasználó csak olvassa az adatokat.
   * Function to generate cell elements.
   *
   * @param {Object} elem - The element to generate cell data for.
   *
   * @returns {Array} The generated cell elements.
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
   * Egy függvény, ahhoz az állapothoz, hogy a felhasználó módosítja-e az adatokat, generál input cellákat.
   *
   * @param {Object} elem - Az elem, amiből cella adatot kell generálni.
   *
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
          veryCoolValue={value}
          value={value}
          handleChange={handleChange}
        />
      </td>
    );

    return CellaGeneralo(elem, cellaLista, cellaTartalom);
  };

  /**
   * Egy függvény, ami a gombokat generálja.
   * Mivel egy sornak két állapota van, ezért eldönti, hogy a felhasználó jelenleg szerkezti-e az adott sort.
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
        <td>
          <Button variant={variant} onClick={onClick}>
            {text}
          </Button>
        </td>
        <td>
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
