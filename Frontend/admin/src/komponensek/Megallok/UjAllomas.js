import { Button } from "react-bootstrap";
import InputMezo from "../InputMezo";
import { Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { useContext, useEffect } from "react";
import { AxiosContext } from "../../context/AxiosContext";
import React from "react";

function UjAllomas(props){

    const {getAll} = useContext(AxiosContext)
    const [nextElement, setNextElement] = React.useState(props.pool[0])

    //const [opcio, setOpciok] = React.useState(null)
    const [adatok, setAdatok] = React.useState(null)

    const { pool, handleSave, name } = props;

    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log("asd", name, value);
        setAdatok(values => ({ ...values, [name[0].toLowerCase() + name.slice(1)]: value }))
        console.log(adatok, "ad");
    }

    useEffect(() => {   
        setNextElement(props.pool[0]??null)
    }, [props.pool[0]]);
   
    if (!props.pool) return null

    return (
        props.pool.length==0
        ?<></>
        :
        <Row>
            <InputMezo as={Col} name="id" value="nev" pool={pool} isSelect={true} handleChange={handleChange}/>
            <InputMezo as={Col} input={{columnName: "ido", dataType: "tinyint"}} handleChange={handleChange}/>
            <Button as={Col} variant="success" onClick={(event) => handleSave(event, adatok, name, handleChange, nextElement)}>Új állomás</Button>
        </Row>
        
    );
}

export default UjAllomas;