import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import InputMezo from './InputMezo';
import { useContext } from 'react';
import { AxiosContext } from '../context/AxiosContext';
import { MetaadatContext } from '../context/MetaadatContext';

function Sor(props) {
    const { patch } = useContext(AxiosContext);
    const { url, findKey, getPKs, kulsoAdatok } = useContext(MetaadatContext);

    const [isAdatUpdate, setIsAdatUpdate] = React.useState(false);
    const [adatok, setAdatok] = React.useState(structuredClone(props.row));
    const regiAdatok = structuredClone(props.row);

    const handleChange = (event) => {
        const { name, type, checked, value } = event.target;
        
        if (type === "checkbox") {
            console.log();
            const engedelyek = adatok[name[0].toLowerCase() + name.slice(1)] ?? []
            if (checked) engedelyek.push(value)
            else engedelyek.splice(engedelyek.indexOf(value), 1)
            setAdatok(values => ({ ...values, [name[0].toLowerCase() + name.slice(1)]: engedelyek }))
        }
        else setAdatok(values => ({ ...values, [name[0].toLowerCase() + name.slice(1)]: value }))
        console.log(adatok);
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

    if(!adatok) return null;

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
        return Object.entries(elem).map(([key, value]) =>{
            if (findKey(key)?.isHidden)
                return null;
            if (findKey(key)?.references && findKey(key)?.references.split("/").length > 1)
                return kulsoAdatok[findKey(key).references].map((opcio, index) => {
                    console.log("aaaaaaaaaaaaaaaa",opcio, index, value);
                    console.warn(Array.isArray(value));
                    return (
                        <td key={opcio}>
                          {Array.isArray(value) 
                            ? (value.includes(opcio) ? "✔️" : "❌") 
                            : (value === opcio ? "✔️" : "❌")
                          }
                        </td>
                      );
                })
            if (typeof value !== "object")
                return <td key={key}>{value}</td>
            return cellaElem(value)
        })
    }

    function inputCella(elem) {
        return Object.entries(elem).map(([key, value]) => {
            //console.log(findKey(key));
            if (findKey(key)?.isHidden)
                return null;
            if (findKey(key)?.references && findKey(key)?.references.split("/").length > 1)
                return kulsoAdatok[findKey(key).references].map((opcio, index) => {
                    console.log("aaaaaaaaaaaaaaaa",opcio, index, value);
                    return <td key={index}><InputMezo key={index} input={findKey(key)} value={opcio} handleChange={handleChange} checked={Array.isArray(value)?value.find(x => x==opcio):value==opcio} pool={[opcio]}/></td>
                })
            if (getPKs().find(pk => pk === key))
                return <td><p>{value}</p></td>
            if (typeof value !== "object")
                return <td key={key}><InputMezo key={key} input={findKey(key)} value={value} handleChange={handleChange} /></td>
            return inputCella(value)
        })
    }

}
export default Sor;