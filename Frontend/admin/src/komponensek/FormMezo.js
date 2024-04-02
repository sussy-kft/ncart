import React, { useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { AxiosContext } from '../context/AxiosContext';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MetaadatContext } from '../context/MetaadatContext';
import InputMezo from './InputMezo';
import { Container } from 'react-bootstrap';

function FormMezo(props) {
    const { post } = useContext(AxiosContext);
    const { metaadat, url } = useContext(MetaadatContext);

    const [validated, setValidated] = React.useState(false);
    const [adatok, setAdatok] = React.useState({});

    console.log("ad",adatok);

    const handleChange = (event) => {
        const { name, type, checked, value } = event.target;

        if (type === "checkbox") {
            const engedelyek = adatok[name] ?? []
            if (checked) engedelyek.push(value)
            else engedelyek.splice(engedelyek.indexOf(value), 1)
            setAdatok(values => ({ ...values, [name]: engedelyek }))
        }
        else setAdatok(values => ({ ...values, [name]: value }))
    }

    const generateInput = (lista) => {
        return lista?.flatMap((input) => {
            if (Array.isArray(input.dataType))
                return generateInput(input.dataType)
            else return(
                    <Form.Group key={input.columnName} as={Col} md="4">
                        <Form.Label>{input.columnName + ": "}</Form.Label>
                        <InputMezo input={input} handleChange={handleChange} />
                        <Form.Control.Feedback type="invalid" />
                    </Form.Group>
                );
        }) || []
    }

    const kuldes = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity()) {
            event.stopPropagation();
            post(url, adatokGenerator(metaadat));
        };
        setValidated(true);
    }

    function adatokGenerator(mintaAdat) {
        return mintaAdat.reduce((tmp, kulcs) => {
            if (Array.isArray(kulcs.dataType))
                tmp[kulcs.columnName] = adatokGenerator(kulcs.dataType);
            else
                tmp[kulcs.columnName] = adatok[kulcs.columnName];
            return tmp;
        }, {});
    }

    if (!metaadat) return <h1>Betöltés...</h1>

    return (
        <Container>
            <Form noValidate validated={validated} onSubmit={(event) => kuldes(event)}>
                <h2 className='mt-3'>Új adat hozzáadása:</h2>
                <Row className='mb-2 mt-3'>
                    {generateInput(metaadat)}
                </Row>
                <Button className='mb-4' type="submit">
                    Küldés
                </Button>
            </Form>
        </Container>
    )
}

export default FormMezo;