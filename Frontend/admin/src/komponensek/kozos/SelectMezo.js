import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useContext } from "react";
import { AxiosContext } from "../../context/Alap/AxiosContext";

/**
 * SelectMezo egy komponens, ami egy select form vezérlőt jelenít meg.
 * A select form vezérlő az `input` segítségével állítja be a szüksges adatokat.
 * Egy flag-et is kezel, hogy a handleChange függvényt csak egyszer hívják meg, így az adatok alapértelmezetten be lesz állítva.
 * Továbbá lekéri opcióit a szerverről (ha esetleg nem opciókat a `pool`-ból), kezeli a változásokat és beállítja az alapértelmezett értéket.
 * 
 * @component
 * @param {string} as - Egy komponens típusa, amibe majd beágyazza a select form vezérlőt.
 * @param {Object} input - Az input mező metaadatai.
 * @param {function} handleChange - Egy callback függvény, ami a select vezérlő változásait kezeli.
 * @param {string} value - A select vezérlő alapértelmezett értéke. Ezt az értéket lehet módisítani a select vezérlőn keresztül.
 * @param {Array} pool - A select vezérlő opcióinak listája. A listában lévő elemekből választhat a felhasználó.
 * @param {string} name - A select vezérlő neve.
 * @param {boolean} idk - Egy flag, amit a select vezérlő értékének beállításához használ, hogy az első elemet válassza ki vagy a kapott értéket.
 * @param {string} veryCoolValue - A select control értékének beállításához használt érték. Ezt az értéket nem lehet módosítani a select vezérlőn keresztül.
 * 
 * @returns {React.Element} Egy Input mezőt ad vissza, ami az `as`-ban megadott komponensbe van beágyazva.
 */
function SelectMezo({
  as = "react.fragment",
  input,
  handleChange,
  value,
  pool,
  name,
  idk,
  veryCoolValue: statikusValue,
}) {
  const { getAll } = useContext(AxiosContext);
  /**
   * Egy useState hook, ami a select vezérlő opcióit kezeli.
   */
  const [opciok, setOpciok] = useState([]);
  /**
   * Egy useState hook, ami flag-et kezel, hogy a handleChange függvényt csak egyszer hívják meg.
   * useState hook to manage a flag that ensures the handleChange function is only called once.
   */
  const [onceFlag, setOnceFlag] = useState(false);
  const As = as ?? "react.fragment";

  /**
   * Egy UseEffect hook, ami a lekéri az opciókat a szerverről, ha a `references` mező nem üres.
   */
  useEffect(() => {
    if (input?.references) getAll(input?.references, setOpciok);
  }, [input?.references]);

  /**
   * Egy UseEffect hook, ami a egy alkalommal meghívja a handleChange függvényt, hogy legyen alapértelmezett értéke.
   */
  useEffect(() => {
    if (
      input?.references?.split("/").length == 1 ||
      (handleChange &&
        !onceFlag &&
        (value || opciok[0]?.id || (pool && pool[0]?.[name])))
    ) {
      handleChange({
        target: {
          name: (name || input?.columnName) ?? "",
          value: idk
            ? (input?.references && opciok[0]?.id) ??
              (pool && pool[0]?.[name]) ??
              value ??
              ""
            : value ??
              (input?.references && opciok[0]?.id) ??
              (pool && pool[0]?.[name]) ??
              "",
          type: typeConverter(input?.dataType) ?? "",
        },
      });
      setOnceFlag(true);
    }
  }, [value, input, opciok[0]?.id, pool]);

  if (!input && !value && !opciok[0]) return null;

  return (
    <As>
      <Form.Control
        as="select"
        required={!input?.isNullable}
        name={(name || input?.columnName) ?? ""}
        defaultValue={value ?? ""}
        {...(statikusValue ? { value: statikusValue ?? {} } : {})}
        onChange={handleChange}
      >
        {input?.references
          ? opciok.map((opcio, index) => (
              <option key={index} value={opcio.id}>
                {opcio.id}
              </option>
            ))
          : pool.map((opcio, index) => (
              <option key={index} value={opcio[name]}>
                {opcio[value]}
              </option>
            ))}
      </Form.Control>
    </As>
  );
}

/**
 * typeConverter egy olyan függvény, ami a backendről kapott típusokat átkonvertálja a megfelelő input típusra.
 *
 *
 * @function
 * @param {string} type - A konvertálni kívánt típus.
 * @returns {string} A megfelelő input típus.
 * @example
 * const inputType = typeConverter('nvarchar'); // returns 'text'
 */
function typeConverter(type) {
  switch (type) {
    case "nvarchar":
      return "text";
    case "float":
    case "int":
    case "smallint":
    case "tinyint":
      return "number";
    case "email":
      return "email";
    case "password":
      return "password";
    case "time":
      return "time";
    default:
      return "text";
  }
}

export default SelectMezo;
