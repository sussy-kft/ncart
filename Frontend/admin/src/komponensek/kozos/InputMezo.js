import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useContext } from "react";
import { AxiosContext } from "../../context/Alap/AxiosContext";
import SelectMezo from "./SelectMezo";

/**
 * @module InputMezo
 * InputMezo egy komponens, ami egy input form vezérlőt jelenít meg.
 * Az input form vezérlő az `input` segítségével állítja be a szüksges adatokat.
 * Egy flag-et is kezel, hogy a handleChange függvényt csak egyszer hívják meg, így az adatok alapértelmezetten be lesz állítva.
 * Továbbá lekéri opcióit a szerverről (ha esetleg nem opciókat a `pool`-ból), kezeli a változásokat és beállítja az alapértelmezett értéket.
 * Ha a `dataType` egy tömb, akkor egy checkboxot jelenít meg.
 * Vagy ha a `references` vagy a `isSelect` nem üres, akkor egy select form vezérlőt jelenít meg a {@link SelectMezo} segítségével.
 *
 * @component
 * @param {Object} props - A komponens propsa.
 * @param {string} props.as - Egy komponens típusa, amibe majd beágyazza az input form vezérlőt.
 * @param {boolean} props.flag - Egy flag, amit a handleChange függvényt csak egyszer hívják meg, így az adatok alapértelmezetten be lesz állítva.
 * @param {Object} props.input - Az input mező metaadatai.
 * @param {boolean} props.isSelect - Egy flag, amit a select vezérlő értékének beállításához használ, hogy az első elemet válassza ki vagy a kapott értéket.
 * @param {function} props.handleChange - Egy callback függvény, ami a select vezérlő változásait kezeli.
 * @param {string} props.value - Az input vezérlő alapértelmezett értéke. Ezt az értéket lehet módisítani az input vezérlőn keresztül.
 * @param {Array} props.pool - Az input vezérlő opcióinak listája. A listában lévő elemekből választhat a felhasználó.
 * @param {string} props.name - Az input vezérlő neve.
 * @param {boolean} props.idk - Egy flag, amit az input vezérlő értékének beállításához használ, hogy az első elemet válassza ki vagy a kapott értéket.
 * @param {string} props.veryCoolValue - Az input control értékének beállításához használt érték. Ezt az értéket nem lehet módosítani a select vezérlőn keresztül.
 * @param {boolean} props.checked - Egy flag, amit a select vezérlő értékének beállításához használ, hogy a checkbox be legyen-e pipálva vagy sem.
 *
 * @returns {React.Element} Egy Input mezőt ad vissza, ami az `as`-ban megadott komponensbe van beágyazva.
 */
function InputMezo({
  as = "react.fragment",
  flag = true,
  input,
  isSelect,
  handleChange,
  value,
  pool,
  name,
  idk,
  veryCoolValue,
  checked,
}) {
  const { getAll } = useContext(AxiosContext);
  /**
   * @memberof InputMezo
   * @description Az adott input mező opciói.
   */
  const [opciok, setOpciok] = useState([]);
  /**
   * @memberof InputMezo
   * @description Egy flag, ami azt jelzi, hogy a handleChange függvényt csak egyszer hívják meg, így az adatok alapértelmezetten be lesz állítva.
   */
  const [onceFlag, setOnceFlag] = useState(false);

  const As = as ?? "react.fragment";

  /**
   * @memberof InputMezo
   * @name useEffect_setOpciok
   * @description Egy UseEffect hook, ami a lekéri az opciókat a szerverről, ha a `references` mező nem üres.
   */
  useEffect(() => {
    if (input?.references) getAll(input?.references, setOpciok);
  }, [input?.references]);

  /**
   * @memberof InputMezo
   * @name useEffect_autoSet
   * @description Egy UseEffect hook, ami a egy alkalommal meghívja a handleChange függvényt, hogy legyen alapértelmezett értéke.
   */
  useEffect(() => {
    if (
      input?.references?.split("/").length == 1 ||
      (isSelect &&
        handleChange &&
        !onceFlag &&
        (value || opciok[0]?.id || (pool && pool[0]?.[name])))
    ) {
      console.log("kys");
      handleChange({
        target: {
          name: (name || input?.columnName) ?? "",
          //ha több időm lenne, akkor nem így csinálnám, de most ez a leggyorsabb megoldás :D
          //ezért megértem, ha nem tetszik, de most ez van
          //ez a kód a leggyorsabb megoldás, hogy a selecteket is kezelni tudjuk
          //ha nem tetszik, akkor kérlek írj egy jobbat

          //ps. ezért megérte megvenni a copilotot, hogy ilyen commenteket írjon
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
    } else if (
      flag &&
      handleChange &&
      !onceFlag &&
      input?.dataType.substring(input?.dataType.length - 2) == "[]"
    ) {
      handleChange({
        target: {
          name: (name || input?.columnName) ?? "",
          type: "checkbox",
          checked: checked ? true : false,
        },
      });
      setOnceFlag(true);
    }
  }, [value, input, opciok[0]?.id, pool]);

  if (!input && !value && !opciok[0]) return null;

  return input?.dataType.substring(input?.dataType.length - 2) == "[]" ? (
    (pool ?? opciok).map((opcio, index) => {
      return (
        <As>
          <Form.Check
            name={input?.columnName}
            key={index}
            value={opcio}
            type={"checkbox"}
            label={opcio}
            defaultChecked={checked}
            onChange={handleChange}
          />
        </As>
      );
    })
  ) : input?.references || isSelect ? (
    <SelectMezo
      as={as}
      flag={flag}
      input={input}
      handleChange={handleChange}
      value={value}
      pool={pool}
      name={name}
      idk={idk}
      veryCoolValue={veryCoolValue}
      checked={checked}
    />
  ) : (
    <As>
      <Form.Control
        as={"input"}
        required={!input?.isNullable}
        name={(name || input?.columnName) ?? ""}
        defaultValue={value ?? ""}
        {...(veryCoolValue ? { value: veryCoolValue ?? {} } : {})}
        type={typeConverter(input?.dataType) ?? ""}
        maxLength={input?.characterMaximumLength ?? ""}
        minLength={input?.characterMinimumLength ?? ""}
        step={"any"}
        min={minConverter(input?.dataType) ?? ""}
        max={maxConverter(input?.dataType) ?? ""}
        onChange={handleChange}
      ></Form.Control>
    </As>
  );
}

/**
 * @memberof InputMezo
 * @description typeConverter egy olyan függvény, ami a backendről kapott típusokat átkonvertálja a megfelelő input típusra.
 *
 *
 * @function
 * @param {string} type - A konvertálni kívánt típus.
 * @returns {string} A megfelelő input típus.
 * @example
 * const inputType = typeConverter('nvarchar'); // returns 'text'
 */
export function typeConverter(type) {
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

/**
 * @memberof InputMezo
 * @description maxConverter egy olyan függvény, ami a backend korlátjához igazodva beállítja a megfelelő maximum értéket.
 *
 *
 * @function
 * @param {string} type - A típus, aminek a maximum értékét be kell állítani.
 * @returns {number|null} A megfelelő maximum érték.
 * @example
 * const minValue = minConverter('int'); // returns 2147483647
 */
export function maxConverter(type) {
  switch (type) {
    case "float":
      return 3.4028235e38;
    case "bigint":
      return Number.MAX_SAFE_INTEGER;
    case "int":
      return Math.pow(2, 31) - 1;
    case "smallint":
      return Math.pow(2, 15) - 1;
    case "tinyint":
      return Math.pow(2, 8) - 1;
    default:
      return null;
  }
}

/**
 * @memberof InputMezo
 * @description minConverter egy olyan függvény, ami a backend korlátjához igazodva beállítja a megfelelő minimum értéket.
 *
 *
 * @function
 * @param {string} type - A típus, aminek a minimum értékét be kell állítani.
 * @returns {number|null} A megfelelő minimum érték.
 * @example
 * const minValue = minConverter('int'); // returns -2147483648
 */
export function minConverter(type) {
  switch (type) {
    case "float":
      return -3.4028235e38;
    case "bigint":
      return Number.MIN_SAFE_INTEGER;
    case "int":
      return -Math.pow(2, 31);
    case "smallint":
      return -Math.pow(2, 15);
    case "tinyint":
      return 0;
    default:
      return null;
  }
}

export default InputMezo;
