import React, { useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { AxiosContext } from '../context/AxiosContext';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MetaAdatContext } from '../context/MetaAdatContext';

function InputMezo(props) {
    const { post } = useContext(AxiosContext);
    const { testget } = useContext(MetaAdatContext);

    const [validated, setValidated] = React.useState(false);   
    const [input, setInput] = React.useState([]);
    const [adatok, setAdatok] = React.useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setAdatok(values => ({ ...values, [name]: value }))
    }
    console.log(adatok);

    const generateInput = (lista) => {
        let tmp = [];
        lista.map((input, ix) => {
            if (Array.isArray(input.dataType))
                tmp = tmp.concat(generateInput(input.dataType));
            else {
                tmp.push(
                    <Form.Group key={input.columnName} as={Col} md="4">
                        <Form.Label>{input.columnName + ": "}
                        <Form.Control
                            required={input.isNullable ? false : true}
                            name={input.columnName}
                            type={typeConverter(input.dataType)}
                            maxLength={input.characterMaximumLength}
                            step={"any"}
                            min={minConverter(input.dataType)}
                            max={maxConverter(input.dataType)}
                            onChange={handleChange} />
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
            post(props.url, adatokGenerator(testget));
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

    useEffect(() => {
        setInput(generateInput(testget));
    }, []);

    return (
        <Form noValidate validated={validated} onSubmit={(event) => kuldes(event)}>
            <Row className='mb-4'>
                {generateInput(testget)}
            </Row>
            <Button type="submit">
                Küldés
            </Button>
        </Form>
    )
}

function typeConverter(type) {
    switch (type) {
        case "nvarchar":
            return "text";
        case "float":
            return "number";
        default:
            return "text";
    }
}

function maxConverter(type){
    switch (type) {
        case "float":
            return 3.4028235e+38
        case "int":
            return Number.MAX_SAFE_INTEGER
        default:
            return null;
    }
}

function minConverter(type){
    switch (type) {
        case "float":
            return -3.4028235e+38
        case "int":
            return Number.MIN_SAFE_INTEGER
        default:
            return null;
    }
}

export default InputMezo;