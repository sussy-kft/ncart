import React, { useEffect } from "react";
import { Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import InputMezo from "../InputMezo";
import kep from "../../media/xd.png"
function AllomasKartya(props) {

    let test = null;
    const { allomas, torol } = props;

    console.log("kartya",allomas.hanyPerc);

    if (!props.allomas) return null
    return (
        <>
            
                <Card className="d-flex flex-row text-start">
                    <Card.Img className="flex-fill" variant="top" src={kep} style={{ maxHeight: "100px",maxWidth: "100px", minHeight: "100px",minWidth: "100px" }} />
                    <Card.Body className="flex-fill text-left ps-0">
                        <Card.Title>{"sussy city" }  (állomás {allomas.allomas})</Card.Title>
                        {/* <Card.Text>{`a ${props.allomas.allomas} - e ${props.allomas.elozoMegallo}`} <br /> */}
                        <Card.Text>
                            {/* előző {allomas.elozoMegallo}<br /> */}
                        <div className="d-flex justify-content-between align-items-center" style={{width: "100%"}}>
                        <div className="d-flex align-items-center">
                            <span className="me-2">idő: </span>
                            <InputMezo veryCoolValue={allomas.hanyPerc} input={{columnName: "hanyPerc", dataType: "tinyint"}} handleChange={(event) => {props.handleChange(allomas, event)}}/> <br/>
                        </div>
                        {torol? <Button variant="danger" onClick={() => props.torol(props.name, allomas)}>Állomás törlése</Button>:null}
                        </div>

                        {/* <br/> */}
                        </Card.Text>
                        {/* {props.allomas.hanyPerc}</Card.Text> */}
                    </Card.Body>
                </Card>
            
        </>
    );
}

export default AllomasKartya;