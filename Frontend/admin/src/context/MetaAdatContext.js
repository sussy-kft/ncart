import { createContext, useContext, useEffect } from 'react';
import React from 'react';
import { AxiosContext } from './AxiosContext';

export const MetaadatContext = createContext();

export const MetaadatProvider = ({ children }) => {
    const { getAll } = useContext(AxiosContext)

    const [url, setUrl] = React.useState("");
    const [metaadat, setMetaadat] = React.useState();
    const [kulsoAdatok, setKulsoAdatok] = React.useState();

    React.useEffect(() => {
        setMetaadat(undefined);
        if (url)
            getAll(url + "/metadata", setMetaadat);
    }, [url]);

    React.useEffect(() => {
        //kys 
        async function a(metaadat) {
            setKulsoAdatok(undefined);
            if (metaadat) {
                let kulsoAdatok2 = {};
                let valaszok = [];

                for (const input of metaadat) {
                    if (Array.isArray(input.dataType)) {
                        a(input.dataType);
                    }
                    else if (input.references) {
                        if (!kulsoAdatok2[input.references]) {
                            valaszok.push( new Promise((resolve) => {
                                getAll(input.references, (adat) => {
                                    kulsoAdatok2[input.references] = adat;
                                    resolve();
                                });
                            }))
                        }
                    }
                }
                await Promise.all(valaszok);
                // console.log("adsfs");
                // console.log(metaadat);
                // console.log(kulsoAdatok2);
                setKulsoAdatok(kulsoAdatok2);
            }
        }
        a(metaadat);
    }, [metaadat]);
    // console.log(metaadat, kulsoAdatok);
    const getPKs = () => {
        if (!metaadat)
            return null
        const PKKereses = lista => {
            return lista.flatMap( input => {
                if (Array.isArray(input.dataType))
                    return PKKereses(input.dataType);
                else if (input.isPartOfPK )
                    return [input.columnName];
                return [];
            });
        }

        let tmp = PKKereses(metaadat);
        return tmp.length > 0 ? tmp : ["id"];
    }

    const findKey = (key, lista = metaadat) => {
        if (!lista)
            return null
            for (const input of lista) {
                if (Array.isArray(input.dataType))
                    return  findKey(key, input.dataType)
                else if (input.columnName.toLowerCase() === key.toLowerCase())
                    return input;
            }
        return null
    }

    return (
        <MetaadatContext.Provider value={{ metaadat, kulsoAdatok, getPKs, findKey, url, setUrl }}>
            {children}
        </MetaadatContext.Provider>
    );
}