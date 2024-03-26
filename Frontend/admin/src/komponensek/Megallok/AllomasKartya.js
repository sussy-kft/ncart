import React from "react";
import { Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import InputMezo from "../InputMezo";


function AllomasKartya(props) {
    
    const { allomas, torol } = props;

    const percToTime = (ido) => {
        let ora = Math.floor(ido/60);
        let perc = ido % 60;
        return `${twodigit(ora)}:${twodigit(perc)}`;
    }

    const twodigit = (num) => {
        return num < 10 ? `0${num}` : num;
    }

    console.log(allomas.hanyPerc);

    if (!props.allomas) return null
    return (
        <>
            
                <Card className="d-flex flex-row text-start">
                    <Card.Img className="flex-fill" variant="top" src={"https://http.cat/300"} style={{ height: "100px",width: "50px" }} />
                    <Card.Body className="flex-fill text-left">
                        <Card.Title>{"sussy city"}</Card.Title>
                        {/* <Card.Text>{`a ${props.allomas.allomas} - e ${props.allomas.elozoMegallo}`} <br /> */}
                        <Card.Text>előző {allomas.elozoMegallo}<br />
                        idő <InputMezo as={Col} value={percToTime(allomas.hanyPerc)} input={{columnName: "hanyPerc", dataType: "time"}} handleChange={(event) => {props.handleChange(allomas, event)}}/> <br/>
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