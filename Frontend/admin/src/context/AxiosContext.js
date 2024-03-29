import { createContext } from 'react';
import React from 'react';
import axios from 'axios';
import InfoPanel from '../komponensek/InfoPanel';
import { InfoPanelContext } from './InfoPanelContext';

export const AxiosContext = createContext();

export const AxiosProvider = ({ children }) => {
    const [axiosId, setAxiosId] = React.useState(Math.random());
    const {addInfoPanel} = React.useContext(InfoPanelContext);
    const baseUrl = "https://localhost:7078/";
    const [errorState, setErrorState] = React.useState(false);

    const getAll = (url, callback, errorCallback) => {
        console.log(baseUrl + url);
        console.log(callback);
        axios.get(baseUrl + url)
        .then(response => {
            setErrorState(false);
            callback(response.data);
        })
        .catch(error => {
            console.log(error);
            if(errorCallback)
                errorCallback();
            else{
                if(error.code === "ERR_NETWORK")
                    setErrorState(true);
                addInfoPanel(<InfoPanel bg={"danger"} text={error.message}/>);
            }
        });
    }

    const getAllPromise = (url, retries = 0) => {
        console.log(baseUrl + url);
        return new Promise((resolve, reject) => {
            axios.get(baseUrl + url)
            .then(response => {
                setErrorState(false);
                resolve(response.data);
            })
            .catch(error => {
                if (retries > 0) {
                    getAllPromise(url, retries - 1)
                    .then(data => resolve(data))
                    .catch(err => reject(err));
                } else {
                    if(error.code === "ERR_NETWORK")
                        setErrorState(true);
                    addInfoPanel(<InfoPanel bg={"danger"} text={error.message}/>);
                    reject(error);
                }
            });
        });
    }

    const destroy = (url, ids) => {
        console.log(baseUrl + url + "/" + ids);
        console.log(ids);
        axios.delete(baseUrl + url + "/" + ids)
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
        console.log(item);
        console.log(baseUrl + url);
        axios.post(baseUrl + url, item)
        .then(response => {
            console.log(response.data);
            console.log(response);
            setAxiosId(Math.random());
            addInfoPanel(<InfoPanel bg={"success"} text={"Az új adat rögzítése sikeres volt!"}/>);
        })
        .catch(error => {
            //error.code
            addInfoPanel(<InfoPanel bg={"danger"} text={error.message}/>);
        })
    }

    const patch = (url, id, item) => {
        console.log(item);
        console.log(baseUrl + url + "/" + id);
        axios.patch(baseUrl + url + "/" + id, item)
        .then(response => {
            console.log(response.data);
            console.log(response);
            setAxiosId(Math.random());
            addInfoPanel(<InfoPanel bg={"success"} text={"A frissítés sikeres volt!"}/>);
        })
        .catch(error => {
            //low effort error handling :(
            //cry about it
            put(url, id, item);
        })
    }

    const put = (url, id, item) => {
        console.log(item);
        console.log(baseUrl + url + "/" + id);
        axios.put(baseUrl + url + "/" + id, item)
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
        <AxiosContext.Provider value={{axiosId, errorState, getAll, getAllPromise, destroy, post, patch}}>
            {children}  
        </AxiosContext.Provider>
    );
}