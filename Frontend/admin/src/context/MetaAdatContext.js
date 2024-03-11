import { createContext, useContext, useEffect } from 'react';
import React from 'react';
import { AxiosContext } from './AxiosContext';

export const MetaadatContext = createContext();

export const MetaadatProvider = ({ children }) => {
    const {getAll} = useContext(AxiosContext)

    const [url, setUrl] = React.useState("");
    const [metaadat, setMetaadat] = React.useState();
    
    React.useEffect(() => {
        setMetaadat(undefined);
        if(url!=="")
            getAll(url+"/metadata", setMetaadat);
        console.log(metaadat);
    }, [url]);
    
    const getPKs = () => {
        if(metaadat===undefined)
        return null
        function PKKereses(lista) {
            let tmp=[];
            lista.map((input)=> {
                if (Array.isArray(input.dataType))
                    tmp = tmp.concat(PKKereses(input.dataType));
                else if (input.isPartOfPK)
                    tmp.push(input.columnName);
            });
            return tmp;
        }

        let tmp = PKKereses(metaadat);
        return tmp.length > 0 ? tmp : ["id"];
    }

    const findKey = (key) => {
        if(metaadat===undefined)
            return null
        function keyFinder(lista) {
            for (const input of lista) {
                if (Array.isArray(input.dataType)){
                    const tmp = keyFinder(input.dataType);
                    if(tmp !== undefined)
                        return tmp
                }
                else if (input.columnName[0].toLowerCase() + input.columnName.slice(1) == key) {
                    return input;
                }
            }
        }

        return keyFinder(metaadat);
    }

    return (
        <MetaadatContext.Provider value={{metaadat, getPKs, findKey, url, setUrl}}>
            {children}  
        </MetaadatContext.Provider>
    );
}