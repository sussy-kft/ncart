import React, { useContext, useEffect } from 'react';
import { useRef } from 'react';
import { AxiosContext } from '../context/AxiosContext';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function InputMezo(props) {
    const { post } = useContext(AxiosContext);

    const [input, setInput] = React.useState([]);
    const [inputok, setInputok] = React.useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputok(values => ({ ...values, [name]: value }))
    }

    const kuldes = (event) => {
        event.preventDefault();
        post(props.url, inputok);
    }

    useEffect(() => {
        const tmp = [];
        //test inputok
        ["text", "number", "submit", "reset", "button", "checkbox", "radio", "file", "hidden", "image", "password", "date", "datetime-local", "month", "time", "week", "email", "url", "search", "tel", "color"].map((type, ix) => {
            tmp.push(<Form.Group as={Col} md="4"><Form.Control name={"balls" + ix} type={type} key={type} onChange={handleChange} /></Form.Group>)
        })
        setInput(tmp);
    }, []);

    return (
        <Form>
            <Row className='mb-3'>
                {input}
                <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Control type="submit" value={props.value} onClick={(event) => kuldes(event)} />
                </Form.Group>
            </Row>
        </Form>
    )
}

export default InputMezo;