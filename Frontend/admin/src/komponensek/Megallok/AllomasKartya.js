import React, { useEffect } from "react";
import { Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import InputMezo from "../InputMezo";

function AllomasKartya(props) {

    let test = null;
    const { allomas, torol } = props;

    console.log("kartya",allomas.hanyPerc);

    if (!props.allomas) return null
    return (
        <>
            
                <Card className="d-flex flex-row text-start">
                    <Card.Img className="flex-fill" variant="top" src={"https://http.cat/300"} style={{ height: "100px",width: "50px" }} />
                    <Card.Body className="flex-fill text-left">
                        <Card.Title>{"sussy city"}</Card.Title>
                        {/* <Card.Text>{`a ${props.allomas.allomas} - e ${props.allomas.elozoMegallo}`} <br /> */}
                        <Card.Text>előző {allomas.elozoMegallo}<br />
                        idő <InputMezo as={Col} veryCoolValue={allomas.hanyPerc} input={{columnName: "hanyPerc", dataType: "tinyint"}} handleChange={(event) => {props.handleChange(allomas, event)}}/> <br/>
                        állomás {allomas.allomas} <br/>
                        {torol? <Button variant="danger" onClick={() => props.torol(props.name, allomas)}>Törlés</Button>:null}
                        </Card.Text>
                        {/* {props.allomas.hanyPerc}</Card.Text> */}
                    </Card.Body>
                </Card>
            
        </>
    );
}

export default AllomasKartya;