import { createContext, useContext, useEffect, useState } from "react";
import { AxiosContext } from "./AxiosContext";

/**
 * @type {React.Context}
 * @description Egy context, ami a metaadatokat tartalmazza.
 * @module MetaadatContext
 */
export const MetaadatContext = createContext();

/**
 * @param {Object} param
 * @param {React.ReactNode} param.children Egy gyerek komponens, amit be akarunk ágyazni.
 * @returns {React.ReactNode} Egy Provider komponenst.
 * @memberof MetaadatContext
 */
export const MetaadatProvider = ({ children }) => {
  const { getAll } = useContext(AxiosContext);

  const [url, setUrl] = useState("");
  const [metaadat, setMetaadat] = useState();
  const [kulsoAdatok, setKulsoAdatok] = useState();

  /**
   * @description Lekérdezi az aktuális oldalhoz a `metaadatokat`.
   * Ha a `url` változik, akkor újra lekéri a `metaadatokat`.
   * @name useEffect_setMetaadat
   * @memberof MetaadatContext
   */
  useEffect(() => {
    setMetaadat(undefined);
    if (url) getAll(url + "/metadata", setMetaadat);
  }, [url]);

  /**
   * @description A referencia adatokat állítja be újra, ha a metaadat változik.
   * Egyes adatok külső kulcsal rendelkezik, emiatt ezeket is le kell kérni.
   * Továbbá, ha a referencia egy beágyazott objektumban van, akkor azt is lekérdezi.
   * @name useEffect_setReferenciak
   * @memberof MetaadatContext
   */
  useEffect(() => {
    const getReferenciak = async (metaadat) => {
      setKulsoAdatok(undefined);
      if (!metaadat) return null;
  
      let kulsoAdatok2 = {};
  
      await Promise.all(flattenArray(metaadat, "dataType")
        .filter(input => input.references)
        .map(input => getAll(input.references).then(adat => {
          kulsoAdatok2[input.references] = adat;
        })));
  
      setKulsoAdatok(kulsoAdatok2);
    };
  
    getReferenciak(metaadat);
  }, [metaadat]);

  /**
   * @function
   * @description Egy függvény, ami egy adott objektum listát kisimít, ha az adott kulcs egy tömb.
   * @memberof MetaadatContext
   * @param {Array.<Object>} array - Egy objektumokat tartalmazó tömb, amit ki szeretnénk simítani.
   * @param {string} key - Ez a kulcs határozza meg, hogy ha az adott objektumnek az adott kulcsa egy tömb, akkor azt is simítsa ki.
   * @returns {Array.<Object>} A kisimított lista.
   */
  const flattenArray = (array, key) =>
    array.flatMap((obj) =>
      Array.isArray(obj[key]) ? [...flattenArray(obj[key])] : obj
    );

  /**
   * @function
   * @description Visszaadja a elsődleges kulcsokat.
   * @memberof MetaadatContext
   * @returns {Array} Az elsődleges kulcsok tömbje.
   */
  const getPKs = () => {
    if (!metaadat) return null;
    const PKKereses = (lista) =>
      lista.flatMap(({ dataType, isPartOfPK, columnName }) =>
        Array.isArray(dataType)
          ? PKKereses(dataType)
          : isPartOfPK
          ? [columnName]
          : []
      );

    let tmp = PKKereses(metaadat);
    return tmp.length > 0 ? tmp : ["id"];
  };

  /**
   * @function
   * @description Megkeresi a kulcsot a metaadatban.
   * @memberof MetaadatContext
   * @param {string} key - A megkeresendő kulcs.
   * @param {Array} lista - A lista, amiben keresni kell. Alapértelmezetten a metaadat, de előfordulhat, 
   * hogy egy beágyazott objektumban kell keresni, ezért rekuzívan megkeresi a kulcsot.
   * @returns {(Object|null)} A megtalált metaadat objektum, ha létezik, egyébként null.
   */
  const findKey = (key, lista = metaadat) => {
    if (!lista) return null;
    for (const input of lista) {
      if (Array.isArray(input.dataType)) {
        const valasz = findKey(key, input.dataType);
        if (valasz) return valasz;
      } else if (input.columnName.toLowerCase() === key.toLowerCase())
        return input;
    }
    return null;
  };

  /**
   * @function
   * @description Egy olyan függvényt hoz létre, 
   * ami kulcsokkal meghívva visszaadja azokat a kulcsokat az `obj` objektumból, 
   * amelyek nincsenek a megadott kulcsok között.
   * @memberof MetaadatContext
   * @param {Object} obj - Az objektum, amelyből a kulcsokat szeretnénk visszakapni.
   * @returns {Function} Egy függvény, ami a kulcsokat kiszűri.
   *
   * @example
   * const obj = { a: 1, b: 2, c: 3, d: 4};
   * const getOppositeKeys = createOppositeKey(obj);
   * console.log(getOppositeKeys('a', 'b')); // Outputs: ['c', 'd']
   */

  const createOppositeKey = (obj) => {
    return (...keys) => Object.keys(obj).filter((k) => !keys.includes(k));
  };
  
  /**
   * @function
   * @description Egy függvény, ami a `localStorage`-ban tárolt `lejaratiIdopont` értékét és a jelenlegi időpontot használja a maradék idő kiszámításához.
   * @memberof MetaadatContext
   * @returns {number} Hogy mennyi idő van hátra.
   */
  const getMaradekIdo = () => (new Date(localStorage.getItem("lejaratiIdopont")) - Date.now());

  return (
    <MetaadatContext.Provider
      value={{
        metaadat,
        kulsoAdatok,
        getPKs,
        findKey,
        url,
        setUrl,
        createOppositeKey,
        getMaradekIdo,
      }}
    >
      {children}
    </MetaadatContext.Provider>
  );
};
