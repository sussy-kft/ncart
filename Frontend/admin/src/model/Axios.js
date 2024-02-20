import axios from 'axios';
import InfoPanel from '../komponensek/InfoPanel';

class AxiosImpostor{
   
    get(url, keys, callback, errorCallback) {
        axios.get("https://localhost:44339/" + url)
        .then((response) => {
            callback(response.data);
        })
        .catch((error) => {
            errorCallback(<InfoPanel text={error}/>);
        });
    }

    delete(url, id, callback, errorCallback) {
        axios.delete("https://localhost:44339/" + url + "/" + id)
        .then(() => {
            console.log(callback);
            callback(<InfoPanel text={"A törlés sikeres volt!"}/>);
        })
        .catch((error) => {
            console.log(error.message);
            //error.code
            errorCallback(<InfoPanel text={error.message}/>);
        });
    }
}

export default AxiosImpostor