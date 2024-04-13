import { createContext, useContext, useEffect, useState } from 'react';
import { AxiosContext } from './AxiosContext';

/**
 * @type {React.Context}
 */
export const MetaadatContext = createContext();

/**
 * @param {React.ReactNode} props.children Egy gyerek komponens, amit be akarunk ágyazni.
 * @returns {React.ReactNode} Egy Provider komponenst.
 */
export const MetaadatProvider = ({ children }) => {
    const { getAll } = useContext(AxiosContext)

    const [url, setUrl] = useState("");
    const [metaadat, setMetaadat] = useState();
    const [kulsoAdatok, setKulsoAdatok] = useState();

    /**
     * Effect to fetch metadata when URL changes.
     */
    useEffect(() => {
        setMetaadat(undefined);
        if (url)
            getAll(url + "/metadata", setMetaadat);
    }, [url]);

    /**
     * 
     * Effect to fetch references when metadata changes.
     */
    useEffect(() => {
        //kys 
        const getReferenciak = async (metaadat) => {
            setKulsoAdatok(undefined);
            if (!metaadat) return null
            
            let kulsoAdatok2 = {};
            const valaszok = metaadat.flatMap(input => 
                Array.isArray(input.dataType)
                    ? getReferenciak(input.dataType)
                    : input.references && !kulsoAdatok2[input.references]
                        ? new Promise((resolve) => {
                            getAll(input.references, (adat) => {
                                kulsoAdatok2[input.references] = adat;
                                resolve();
                            });
                        }) 
                        : []
                
                );
            await Promise.all(valaszok);
            setKulsoAdatok(kulsoAdatok2);   
        }
        getReferenciak(metaadat);
    }, [metaadat]);
    
    /**
     * Visszaadja a elsődleges kulcsokat.
     * @returns {Array} Az elsődleges kulcsok tömbje.
     */
    const getPKs = () => {
        if (!metaadat)
            return null
        const PKKereses = lista => 
            lista.flatMap( ({ dataType, isPartOfPK, columnName }) => 
                (Array.isArray(dataType))
                    ? PKKereses(dataType)
                    : isPartOfPK
                        ? [columnName]
                        : []
            );
        

        let tmp = PKKereses(metaadat);
        return tmp.length > 0 ? tmp : ["id"];
    }

    /**
     * Megkeresi a kulcsot a metaadatban.
     * @param {string} key - A megkeresendő kulcs. 
     * @param {Array} lista - A lista, amiben keresni kell. Alapértelmezetten a metaadat, de a rekurzió miatt más elemet is meghív a függvény.
     * @returns {Object} A megtalált objektum, ha létezik, egyébként null.
     */
    const findKey = (key, lista = metaadat) => {
        if (!lista)
            return null
            for (const input of lista) {
                if (Array.isArray(input.dataType)){
                    const valasz = findKey(key, input.dataType);
                    if (valasz)
                        return valasz;
                }
                else if (input.columnName.toLowerCase() === key.toLowerCase())
                    return input;
            }
        return null
    }

    return (
        <MetaadatContext.Provider value={{ metaadat, kulsoAdatok, getPKs, findKey, url, setUrl}}>
            {children}
        </MetaadatContext.Provider>
    );
}