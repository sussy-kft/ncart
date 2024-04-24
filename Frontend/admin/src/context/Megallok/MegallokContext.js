import React, { createContext, useContext, useState, useEffect } from "react";
import { MetaadatContext } from "../Alap/MetaadatContext";
import _ from "lodash";

export const MegallokContext = createContext();

/**
 * Egy Provider komponens, ami kontextust biztosít a megállók állapotának kezelésére mindkét irányban.
 *
 * @component
 * @param {Object} props - A komponens propsa.
 * @param {ReactNode} props.children - Egy gyerek komponens, amit be akarunk ágyazni.
 * @module MegallokContext
 * @returns {ReactNode} Egy `MegallokContext.Provider` komponenst a kontextus értékeivel és metódusaival. 
 */
export const MegallokProvider = ({ children }) => {
  const { createOppositeKey } = useContext(MetaadatContext);

  const [megallok, setMegallok] = useState(null);
  const [regiMegallok, setRegiMegallok] = useState(null);

  const [checked, setChecked] = useState(false);
  const [show, setShow] = useState(false);

  /**
   * @function
   * @description A `megallok` és a `regiMegallok` állapotokat is egyszerre beállítja.
   * @memberof MegallokContext
   * @param {Object} mindketto - Az új oda/vissza megállók állapota.
   */
  const setMindketto = (mindketto) => {
    setMegallok(mindketto);
    setRegiMegallok(mindketto);
  };
  
  /**
   * @function
   * @description Átmásolja a megállókat a listában a másik megállóba és megfordítja őket.
   * @memberof MegallokContext
   * @param {string} key - A megállók kulcsa, amit át akarunk másolni fordítva.
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
   * @function
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
   * @function
   * @memberof MegallokContext
   * @description {@link MetaadatContext} segítségével létrehozza az ellenkező irányú kulcsot a megállókhoz.
   */
  const oppositeKey = createOppositeKey(megallok);

  /**
   * @name useEffect_vanValtozas
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
