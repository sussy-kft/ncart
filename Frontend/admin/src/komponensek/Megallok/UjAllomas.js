import { Button, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import InputMezo from "../InputMezo";

/**
 * @param {Array} pool - Azok a megállók, amik még nem szerepelnek az adott vonalon.
 * @param {Function} handleSave - Egy callback függvény, akkor hívódik meg, ha a mentés gombra kattint a felhasználó.
 * @returns {React.Component} `UjAllomas` komponenst
 */
function UjAllomas({ pool, handleSave }){

    /**
     * Az új állomás adatai
     * @type {[Object, Function]}
     */
    const [adatok, setAdatok] = useState({... pool[0], ido: 1})

    /**
     * A változásokért felelős függvény
     * @param {Object} event - Egy esemény objektum.
     * @param {Object} event.target.name - A változtatni kívánt objektum kulcsa az `adatok` objektumban.
     * @param {Object} event.target.value - Az új érték, amit be kell állítani. 
     */
    const handleChange = ({target: { name, value }}) => {
        setAdatok(values => ({ ...values, [name[0].toLowerCase() + name.slice(1)]: value }))
    }

    /**
     * A következő elem.
     * Ha az első elemet választotta ki, a fejhasználó, akkor annak a következő elemét adja vissza.
     * @returns {Object} A következő elem, ami automatikusan kiválasztódik
     */
    const getKovSor = () => adatok.id === pool[0]?.id??null ? pool[1] : pool[0]
   
    if (!pool || pool.length === 0) return null

    return (
        <Row className="mb-3 mt-3">
            <InputMezo as={Col} name="id" value="nev" pool={pool} isSelect={true} idk={true} handleChange={handleChange}/>
            <InputMezo as={Col} input={{columnName: "ido", dataType: "tinyint"}} value="1" handleChange={handleChange}/>
            <Button as={Col} variant="success" onClick={(event) => handleSave(event, adatok, handleChange, getKovSor())} style={{marginRight: "12px"}}>Új állomás</Button>
        </Row>    
    );
}

export default UjAllomas;