import { createContext, useContext, useEffect } from 'react';
import React from 'react';
import { AxiosContext } from './AxiosContext';

export const MetaadatContext = createContext();

export const MetaadatProvider = ({ children }) => {
    const { getAll } = useContext(AxiosContext)

    const [url, setUrl] = React.useState("");
    const [metaadat, setMetaadat] = React.useState();

    React.useEffect(() => {
        setMetaadat(undefined);
        if (url)
            getAll(url + "/metadata", setMetaadat);
    }, [url]);

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
        <MetaadatContext.Provider value={{ metaadat, getPKs, findKey, url, setUrl }}>
            {children}
        </MetaadatContext.Provider>
    );
}