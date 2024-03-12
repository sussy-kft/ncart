import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import InputMezo from './InputMezo';
import { useContext } from 'react';
import { AxiosContext } from '../context/AxiosContext';
import { MetaadatContext } from '../context/MetaadatContext';

function Sor(props) {
    const { patch } = useContext(AxiosContext);
    const { url, findKey, getPKs } = useContext(MetaadatContext);

    const [isAdatUpdate, setIsAdatUpdate] = React.useState(false);
    const [adatok, setAdatok] = React.useState(structuredClone(props.row));
    const regiAdatok = structuredClone(props.row);

    const handleChange = ({ target: { name, value } }) => {
        (function jelenAdatok(lista) {
            Object.entries(lista).forEach(([key, val]) => {
                if (typeof val === "object")
                    jelenAdatok(val);
                else if (key === name[0].toLowerCase() + name.slice(1))
                    lista[key] = value;
            })
        })(adatok);
    }

    const getPKadat = () => {
        return getPKs().map(value =>
            adatok[value[0].toLowerCase() + value.slice(1)]
        ).join("/");
    }

    const reset = () => {
        setAdatok(regiAdatok);
        setIsAdatUpdate(false);
    }

    return isAdatUpdate
        ? (
            <tr key={props.ix}>
                {inputCella(adatok)}
                <td><Button variant="success" onClick={() => patch(url, getPKadat(), adatok)}>Küldés</Button></td>
                <td><Button variant="danger" onClick={reset}>Mégse</Button></td>
            </tr>
        )
        : (
            <tr key={props.ix}>
                {cellaElem(adatok)}
                {getPKs().length === Object.keys(adatok).length || <td><Button variant="primary" onClick={() => setIsAdatUpdate(true)}>Módosítás</Button></td>}
                <td><Button key="danger" variant="danger" onClick={() => props.callback(adatok)}>Törlés</Button></td>
            </tr>
        )


    function cellaElem(elem) {
        return Object.entries(elem).map(([key, value]) =>
            typeof value !== "object" ? <td key={key}>{value}</td> : cellaElem(value)
        )
    }

    function inputCella(elem) {
        return Object.entries(elem).map(([key, value]) => {
            console.log(findKey(key));
            if (getPKs().find(pk => pk === key))
                return <td><p>{value}</p></td>
            if (typeof value !== "object")
                return <td><InputMezo key={key} input={findKey(key)} value={value} handleChange={handleChange} /></td>
            return inputCella(value)
        })
    }

}
export default Sor;