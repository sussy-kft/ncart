import { createContext, useState, useContext } from 'react';
import axios from 'axios';
import InfoPanel from '../../komponensek/kozos/InfoPanel';
import { InfoPanelContext } from './InfoPanelContext';

/**
 * @module AxiosContext
 * @description 
 * Az AxiosContext segítségével érhető el az AxiosProvider által biztosított állapotok és metódusok.
 * @kind context
 * @type {React.Context}
 */
export const AxiosContext = createContext();

/**
 * Az AxiosProvider komponens, ami az AxiosContext.Provider-t biztosítja.
 * Ennek segítségével érhető el az AxiosContext által biztosított változók és metódusok.
 * @memberof AxiosContext
 * @param {Object} props - A komponens propsa
 * @param {React.Component} props.children - Gyerek komponenst, ami használja az AxiosContext által biztosított változókat és metódusokat.
 * @returns {React.Element} A gyerek komponesnt `AxiosProvider`-rel beágyazva.
 */
export const AxiosProvider = ({ children }) => {
    const [axiosId, setAxiosId] = useState(Math.random());
    const { addInfoPanel } = useContext(InfoPanelContext);
    const baseUrl = "https://localhost:44339/";
    const [errorState, setErrorState] = useState(false);
    const header = { headers: { Authorization: "Bearer " + localStorage.getItem("token") } };

    /**
     * A HTTP kéréseket kezeli.
     * @async
     * @function handleRequest
     * @memberof AxiosContext
     * @param {Object} params - A kérés paraméterei.
     * @param {string} params.method - HTTP metódus
     * @param {string} params.url - URL végpont (egyes végpontok a `/` jellel elválasztva azonostják a elsődleges kulcsokat, hogy az adott adatra hivatkozzanak)
     * @param {Object} [params.data=null] - Adatok, amiket a kérés során elküldünk, hogy feldolgozásra kerüljenek
     * @param {string} [params.successMessage=null] - Info panel üzenete, ha sikeres a kérés
     * @param {Function} [params.callback=null] - Callback függvény
     * @param {Function} [params.errorCallback=null] - Error callback függvény
     * @returns {Promise<Object>} A kérés válasza
     */
    const handleRequest = async ({ method, url, data = null, successMessage = null, callback = null, errorCallback = null }) => {
        try {
            const response = await axios[method](baseUrl + url, method === 'delete' ? { data: data, ...header } : data, header);
            setErrorState(false);
            if (method !== 'get') {
                setAxiosId(Math.random());
                successMessage && addInfoPanel(<InfoPanel bg={"success"} text={successMessage} />);
            }
            if (typeof response.data === 'object' && response.data !== null) {
                const oldProto = Object.getPrototypeOf(response.data);
                const newProto = Object.create(oldProto);
                newProto.url = url;
                Object.setPrototypeOf(response.data, newProto);
            }
            callback && callback(response.data);
            return response.data;
        } catch (error) {
            if (method === 'patch') 
                HTTP_METODUSOK.put(url, data);
            else 
            {
                if (error.code === "ERR_NETWORK") 
                    setErrorState(true);
                errorCallback 
                    ? errorCallback(error)
                    : addInfoPanel(<InfoPanel bg={"danger"} text={error.message} />);
            }
        }
    };

    /**
     * Egy Objektum, ami tartalmazza a HTTP kérésekhez szükséges metódusokat. (GET, POST, PUT, PATCH, DELETE)
     * @memberof AxiosContext
     * @type {Object}
     * @param {Object} request - A kérés paraméterei
     * @param {string} request.url - URL végpont (egyes végpontok a `/` jellel elválasztva azonostják a elsődleges kulcsokat, hogy az adott adatra hivatkozzanak)
     * @param {Function} request.callback - Callback függvény
     * @param {Function} request.errorCallback - Error callback függvény
     * @param {Object} request.item - Az adat, amit feldolgozni akarunk
     * @param {string} request.id - Az id, amit változtatni akarunk
     */
    const HTTP_METODUSOK = {
        getAll: (url, callback, errorCallback) => handleRequest({ method: 'get', url, callback, errorCallback }),
        destroy: (url, id) => handleRequest({ method: 'delete', url: url + "/" + id, successMessage: "A törlés sikeres volt!" }),
        post: (url, item, callback) => handleRequest({ method: 'post', url, data: item, successMessage: "Az új adat rögzítése sikeres volt!", callback }),
        patch: (url, id, item) => handleRequest({ method: 'patch', url: url + "/" + id, data: item, successMessage: "A frissítés sikeres volt!" }),
        put: (url, item) => handleRequest({ method: 'put', url, data: item, successMessage: "A frissítés sikeres volt!" })
    };

    return (
        <AxiosContext.Provider value={{ axiosId, errorState, ...HTTP_METODUSOK }}>
            {children}
        </AxiosContext.Provider>
    );
}