import { createContext, useId } from 'react';
import React from 'react';
import axios from 'axios';
import InfoPanel from '../komponensek/InfoPanel';
import { InfoPanelContext } from './InfoPanelContext';

export const AxiosContext = createContext();

export const AxiosProvider = ({ children }) => {
    const [axiosId, setAxiosId] = React.useState(Math.random());
    const {addInfoPanel} = React.useContext(InfoPanelContext);

    const get = (url, keys, callback, errorCallback) => {
        axios.get("https://localhost:44339/" + url)
        .then(response => {
            callback(response.data);
        })
        .catch(error => {
            errorCallback(<InfoPanel bg={"danger"} text={error.message}/>);
        });
    }

    const destroy = (url, id) => {
        axios.delete("https://localhost:44339/" + url + "/" )
        .then(response => {
            console.log(response.data);
            console.log(response);
            setAxiosId(Math.random());
            addInfoPanel(<InfoPanel bg={"success"} text={"A törlés sikeres volt!"}/>);
        })
        .catch(error => {
            //error.code
            addInfoPanel(<InfoPanel bg={"danger"} text={error.message}/>);
        })
    }
    
    return (
        <AxiosContext.Provider value={{axiosId, get, destroy}}>
            {children}  
        </AxiosContext.Provider>
    );
}