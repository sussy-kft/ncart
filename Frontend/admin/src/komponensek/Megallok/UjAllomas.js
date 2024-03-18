import { Button } from "react-bootstrap";
import InputMezo from "../InputMezo";
import { Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { useContext } from "react";
import { AxiosContext } from "../../context/AxiosContext";
import React from "react";

function UjAllomas(props){

    const {getAll} = useContext(AxiosContext)

    const [opcio, setOpciok] = React.useState(null)
    const [adatok, setAdatok] = React.useState(null)

    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value);
        setAdatok(values => ({ ...values, [name[0].toLowerCase() + name.slice(1)]: value }))
    }

    React.useEffect(() => {
        
        getAll("allomasok",setOpciok);
    
    }, []);
   
    if (!opcio) return null

    return (
        <Row>
            <InputMezo as={Col} name={"id"} value={"nev"} pool={opcio} isSelect={true} handleChange={handleChange}/>
            <InputMezo as={Col} input={{columnName: "ido", dataType: "time"}} handleChange={handleChange}/>
            <Button as={Col} variant="success" onClick={(event) => props.handleSave(event, adatok)}>Új állomás</Button>
        </Row>
    );
}

export default UjAllomas;