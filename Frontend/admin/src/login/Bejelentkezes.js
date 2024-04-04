import React from 'react';
import { Form } from 'react-bootstrap';
import InputMezo from '../komponensek/InputMezo';
import Button from 'react-bootstrap/Button';
import { AxiosContext } from '../context/AxiosContext';
import "./Bejelentkezes.css";
import { useNavigate } from 'react-router-dom';
import { DarkModeContext } from '../context/DarkModeContext';

function Bejelentkezes()
{
    const {getText} = React.useContext(DarkModeContext);
    const { post } = React.useContext(AxiosContext);
    
    const navigate = useNavigate();
    const inputs = [{columnName: "email", dataType: "email"}, {columnName: "password", dataType: "password", characterMinimumLength: 8}]

    const [validated, setValidated] = React.useState(false);
    const [adatok, setAdatok] = React.useState({});

    const inputGenerator = (lista) => {
        return lista?.map((input) => {
            return (
                <Form.Group className="mb-3" key={input.columnName}>
                    <Form.Label>{input.columnName + ": "}</Form.Label>
                        <InputMezo input={input} handleChange={handleChange} />
                    <Form.Control.Feedback type="invalid" />
                </Form.Group>
            );
        }) || []
    }

    const handleSumbit = (event) => {
        event.preventDefault();
        setValidated(true);
        post("kezelok/login", adatok, (valasz) =>{
                window.sessionStorage.setItem('felhasznalo', adatok.email);
                console.log(adatok.email);
                localStorage.setItem("token", valasz);
                navigate("/admin");
        });
    }

    const handleChange = (event) => {
        setAdatok(values => ({ ...values, [event.target.name]: event.target.value }))
    }
    
    return (
        <div className="d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
            <Form noValidate validated={validated} 
            id="bejelentkezes" 
            style={{backgroundColor: getText() === "dark" ? "#1f2938" : "#f3f4f6", color: getText() === "dark" ? "white" : "black"}}   
                onSubmit={event => handleSumbit(event)}>
                {/* <Form.Label>Bejelentkezés</Form.Label> */}
                {inputGenerator(inputs)}
                <div className="d-flex justify-content-end mt-5">
                <Button type="submit" variant={getText() === "dark" ? "light" : "dark"}>
                    Bejelentkezés
                </Button>
                </div>
            </Form>
        </div>
    );
}

export default Bejelentkezes;