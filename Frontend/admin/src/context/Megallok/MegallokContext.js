import React, { createContext, useContext, useState, useEffect } from "react";
import { MetaadatContext } from "../Alap/MetaadatContext";
import _ from "lodash";

export const MegallokContext = createContext();

/**
 * @module MegallokContext
 */

/**
 * Egy Provider komponens, ami kontextust biztosít a megállók állapotának kezelésére mindkét irányban.
 *
 * @component
 * @param {ReactNode} children - Egy gyerek komponens, amit be akarunk ágyazni.
 * @memberof MegallokContext
 * @returns {ReactNode} Egy `MegallokContext.Provider` komponenst a kontextus értékeivel és metódusaival. 
 */
export const MegallokProvider = ({ children }) => {
  const { createOppositeKey } = useContext(MetaadatContext);

  const [megallok, setMegallok] = useState(null);
  const [regiMegallok, setRegiMegallok] = useState(null);

  const [checked, setChecked] = useState(false);
  const [show, setShow] = useState(false);

  /**
   * @description A `megallok` és a `regiMegallok` állapotokat is egyszerre beállítja.
   * @memberof MegallokContext
   * @param {Object} mindketto - Az új oda/vissza megállók állapota.
   */
  const setMindketto = (mindketto) => {
    setMegallok(mindketto);
    setRegiMegallok(mindketto);
  };
  
  /**
   * @description Átmásolja a megállókat a listában a másik megállóba és megfordítja őket.
   * @memberof MegallokContext
   * @param {string} key - The key of the stop to copy and reverse.
   */
  const atmasol = (key) => {
    let tmp = _.cloneDeep(megallok[key].megallok);

    megfordit(tmp.reverse());

    setMegallok((prevMegallok) => ({
      ...prevMegallok,
      [oppositeKey(key)]: {
        megallok: tmp,
        vonal: _.cloneDeep(prevMegallok[oppositeKey(key)].vonal),
      },
    }));
  };

  /**
   * @description Megfordítja a megállókat a listában.
   * @memberof MegallokContext
   * @param {Array} lista - Egy lista, amit meg akarunk fordítani.
   * @returns {Array} A megfordított lista.
   */
  const megfordit = (lista) => {
    let copy = [...lista];

    for (let ix = 0; ix < copy.length; ix++) {
      [copy[ix].allomas, copy[ix].elozoMegallo] = [
        copy[ix].elozoMegallo,
        copy[ix].allomas,
      ];
    }

    return copy;
  };

  /**
   * @memberof MegallokContext
   * @description {@link MetaadatContext} segítségével létrehozza az ellenkező irányú kulcsot a megállókhoz.
   */
  const oppositeKey = createOppositeKey(megallok);

  /**
   * @memberof MegallokContext
   * @description Ha a megállók állapota megváltozik a régi állapothoz képest, akkor megjeleníti a mentés gombot.
   */
  useEffect(() => {
    setShow(!_.isEqual(megallok, regiMegallok));
  }, [megallok]);

  return (
    <MegallokContext.Provider
      value={{
        megallok,
        setMegallok,
        regiMegallok,
        setRegiMegallok,
        checked,
        setChecked,
        show,
        setShow,
        setMindketto,
        oppositeKey,
        atmasol,
        megfordit,
      }}
    >
      {children}
    </MegallokContext.Provider>
  );
};
