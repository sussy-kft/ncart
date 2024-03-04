import React from 'react';
import Button from 'react-bootstrap/Button';
import InputMezo from './InputMezo';
import { useContext } from 'react';
import { AxiosContext } from '../context/AxiosContext';
import { MetaadatContext } from '../context/MetaadatContext';

function Sor(props) {
    const { patch } = useContext(AxiosContext);
    const { url, findKey, getPKs } = useContext(MetaadatContext);
    
    const [isAdatUpdate, setIsAdatUpdate] = React.useState(false);
    const [adatok, setAdatok] = React.useState(props.row);

    const handleChange = (event) => {
        function bruh(lista) {
            for (const key in lista) {
                if (typeof lista[key] === "object")
                    bruh(lista[key]);
                else if (key === event.target.name[0].toLowerCase() + event.target.name.slice(1))
                    lista[key] = event.target.value;
            }
        }
        bruh(adatok);
        console.log(adatok);
    }

    const getPKadat = () => {
            let tmp = [];
            for (const [key, value] of Object.entries(getPKs())){
                tmp.push(adatok[value[0].toLowerCase() + value.slice(1)]);
            }
            return tmp.join("/");
        }


    return isAdatUpdate
        ? (
            <tr key={props.ix}>
                {inputCella(adatok)}
                <td><Button variant="primary" onClick={() => patch(url, getPKadat() ,adatok )}>Küldés</Button></td>
                <td><Button variant="danger" onClick={() => setIsAdatUpdate(false)}>Mégse</Button></td>
            </tr>
        )
        : (
            <tr key={props.ix}>
                {cellaElem(adatok)}
                <td><Button key="primary" variant="primary" onClick={() => setIsAdatUpdate(true)}>Módosítás</Button></td>
                <td><Button key="danger" variant="danger" onClick={() => { props.callback(adatok) }}>Törlés</Button></td>
            </tr>
        )


function cellaElem(elem) {
    const tmp = [];
    tmp.push(Object.keys(elem).map(key => {
        if (typeof elem[key] !== "object")
            return <td key={key}>{elem[key]}</td>
        else
            return cellaElem(elem[key])
    }))
    return tmp;
}

function inputCella(elem) {
    const tmp = [];
    tmp.push(Object.keys(elem).map(key => {
        
        if (key === "id"){
            return <td><InputMezo key={key} input={props.row} readOnly={true} value={elem[key]}/></td>
        }
        else if (typeof elem[key] !== "object"){
            console.log(findKey(key));
            return <td><InputMezo key={key} input={findKey(key)} value={elem[key]} handleChange={handleChange} /></td>
        }
        else
            return inputCella(elem[key])
    }))
    return tmp;
}

}
export default Sor;