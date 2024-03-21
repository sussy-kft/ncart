import React from "react";
import { Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";


function AllomasKartya(props) {
    if (!props.allomas) return null
    return (
        <>
            
                <Card className="d-flex flex-row text-start">
                    <Card.Img className="flex-fill" variant="top" src={"https://http.cat/300"} style={{ height: "100px",width: "50px" }} />
                    <Card.Body className="flex-fill text-left">
                        <Card.Title>{"sussy city"}</Card.Title>
                        {/* <Card.Text>{`a ${props.allomas.allomas} - e ${props.allomas.elozoMegallo}`} <br /> */}
                        <Card.Text>{props.allomas.allomas} <br />
                        {props.allomas.hanyPerc}</Card.Text>
                    </Card.Body>
                </Card>
            
        </>
    );
}

export default AllomasKartya;