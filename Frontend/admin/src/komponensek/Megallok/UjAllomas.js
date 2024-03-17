import { Button } from "react-bootstrap";
import InputMezo from "../InputMezo";
import { Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";


function UjAllomas(props){

    return (
        <Row>
            <Col><InputMezo input={{columnName: "ido", dataType: "time"}}/></Col>
            <Button as={Col} variant="success">Új állomás</Button>
        </Row>
    );
}

export default UjAllomas;