import React, { useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { AxiosContext } from '../context/AxiosContext';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MetaadatContext } from '../context/MetaadatContext';
import InputMezo from './InputMezo';

function FormMezo(props) {
    const { post } = useContext(AxiosContext);
    const { metaadat, url } = useContext(MetaadatContext);

    const [validated, setValidated] = React.useState(false);
    const [adatok, setAdatok] = React.useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setAdatok(values => ({ ...values, [name]: value }))
    }

    const generateInput = (lista) => {
        let tmp = [];
        if(lista===undefined)
            return tmp
        lista.map((input, ix) => {
            if (Array.isArray(input.dataType))
                tmp = tmp.concat(generateInput(input.dataType));
            else {
                tmp.push(
                    <Form.Group key={input.columnName} as={Col} md="4">
                        <Form.Label>{input.columnName + ": "}
                        <InputMezo input={input} handleChange={handleChange}/>
                        </Form.Label>
                        <Form.Control.Feedback type="invalid"/>
                    </Form.Group>
                );
            }
        });
        return tmp;
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
        let tmp = {};
        mintaAdat.map((kulcs) => {
            if (Array.isArray(kulcs.dataType))
                tmp[kulcs.columnName] = adatokGenerator(kulcs.dataType);
            else {
                tmp[kulcs.columnName] = adatok[kulcs.columnName];
            }
        });
        return tmp;
    }

    if (!metaadat) return <h1>Betöltés...</h1>

    return (
        <Form noValidate validated={validated} onSubmit={(event) => kuldes(event)}>
            <Row className='mb-4'>
                {generateInput(metaadat)}
            </Row>
            <Button type="submit">
                Küldés
            </Button>
        </Form>
    )
}

export default FormMezo;