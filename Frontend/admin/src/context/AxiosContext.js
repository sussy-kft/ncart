import { createContext, useId } from 'react';
import React from 'react';
import axios from 'axios';
import InfoPanel from '../komponensek/InfoPanel';
import { InfoPanelContext } from './InfoPanelContext';

export const AxiosContext = createContext();

export const AxiosProvider = ({ children }) => {
    const [axiosId, setAxiosId] = React.useState(Math.random());
    const {addInfoPanel} = React.useContext(InfoPanelContext);
    const baseUrl = "https://localhost:44339/";

    const get = (url, keys, callback, errorCallback) => {
        axios.get(baseUrl + url)
        .then(response => {
            callback(response.data);
        })
        .catch(error => {
            errorCallback(<InfoPanel bg={"danger"} text={error.message}/>);
        });
    }

    const destroy = (url, id) => {
        axios.delete(baseUrl + url + "/" + id)
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

    const post = (url, item) => {
        axios.post(baseUrl + url, item)
        .then(response => {
            console.log(response.data);
            console.log(response);
            setAxiosId(Math.random());
            addInfoPanel(<InfoPanel bg={"success"} text={"A frissítés sikeres volt!"}/>);
        })
        .catch(error => {
            //error.code
            addInfoPanel(<InfoPanel bg={"danger"} text={error.message}/>);
        })
    }

    const patch = (url, id, item) => {
        axios.patch(baseUrl + url + "/" + id, item)
        .then(response => {
            console.log(response.data);
            console.log(response);
            setAxiosId(Math.random());
            addInfoPanel(<InfoPanel bg={"success"} text={"A frissítés sikeres volt!"}/>);
        })
        .catch(error => {
            //error.code
            addInfoPanel(<InfoPanel bg={"danger"} text={error.message}/>);
        })
    }
    
    return (
        <AxiosContext.Provider value={{axiosId, get, destroy, post, patch}}>
            {children}  
        </AxiosContext.Provider>
    );
}