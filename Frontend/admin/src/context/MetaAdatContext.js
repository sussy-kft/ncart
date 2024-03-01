import { createContext, useContext, useEffect } from 'react';
import React from 'react';
import { AxiosContext } from './AxiosContext';

export const MetaadatContext = createContext();

export const MetaadatProvider = ({ children }) => {
    const {getAll} = useContext(AxiosContext)

    const [url, setUrl] = React.useState("");
    const [metaadat, setMetaadat] = React.useState();
    
    React.useEffect(() => {
        if(url!=="")
            getAll(url+"/metadata", setMetaadat);
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

    return (
        <MetaadatContext.Provider value={{metaadat, getPKs, url, setUrl}}>
            {children}  
        </MetaadatContext.Provider>
    );
}