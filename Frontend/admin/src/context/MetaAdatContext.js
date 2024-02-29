import { createContext } from 'react';
import React from 'react';

export const MetaAdatContext = createContext();

export const MetaAdatProvider = ({ children }) => {
    
    const testget = [
        {
            "columnName": "Nev",
            "dataType": "nvarchar",
            "isNullable": false,
            "partOfPK": false,
            "references": null,
            "characterMaximumLength": 64
        },
        {
            "columnName": "Koord",
            "dataType": [
                {
                    "columnName": "X",
                    "dataType": [
                        {
                            "columnName": "X",
                            "dataType": "float",
                            "isNullable": false,
                            "partOfPK": false,
                            "references": null,
                            "characterMaximumLength": null
                        },
                        {
                            "columnName": "Y",
                            "dataType": "float",
                            "isNullable": false,
                            "partOfPK": false,
                            "references": null,
                            "characterMaximumLength": null
                        }
                    ],
                    "isNullable": false,
                    "partOfPK": false,
                    "references": null,
                    "characterMaximumLength": null
                },
                {
                    "columnName": "Y",
                    "dataType": [
                        {
                            "columnName": "X",
                            "dataType": "float",
                            "isNullable": false,
                            "partOfPK": false,
                            "references": null,
                            "characterMaximumLength": null
                        },
                        {
                            "columnName": "Y",
                            "dataType": "float",
                            "isNullable": false,
                            "partOfPK": false,
                            "references": null,
                            "characterMaximumLength": null
                        }
                    ],
                    "isNullable": false,
                    "partOfPK": false,
                    "references": null,
                    "characterMaximumLength": null
                }
            ],
            "isNullable": false,
            "partOfPK": false,
            "references": null,
            "characterMaximumLength": null
        }
    ] 

    const getPKs = () => {
        function PKKereses(lista) {
            let tmp=[];
            lista.map((input, ix) => {
                if (Array.isArray(input.dataType))
                tmp = tmp.concat(PKKereses(input.dataType));
            else if (input.partOfPK)
            tmp.push(input.columnName);
            });
            return tmp;
        }

        let tmp = PKKereses(testget);
        return tmp.length > 0 ? tmp : ["id"];
    }

    return (
        <MetaAdatContext.Provider value={{testget, getPKs}}>
            {children}  
        </MetaAdatContext.Provider>
    );
}