import axios from 'axios';
import InfoPanel from '../komponensek/InfoPanel';

class AxiosImpostor{
   
    get(url, keys, callback, errorCallback) {
        axios.get("https://localhost:44339/" + url)
        .then(response => {
            callback(response.data);
        })
        .catch(error => {
            errorCallback(<InfoPanel bg={"danger"} text={error.message}/>);
        });
    }

    delete(url, id, callback, errorCallback) {
        axios.delete("https://localhost:44339/" + url + "/" + id)
        .then(response => {
            console.log(response.data);
            console.log(response);
            callback(<InfoPanel bg={"success"} text={"A törlés sikeres volt!"}/>);
        })
        .catch(error => {
            //error.code
            errorCallback(<InfoPanel bg={"danger"} text={error.message}/>);
        })
    }
}

export default AxiosImpostor