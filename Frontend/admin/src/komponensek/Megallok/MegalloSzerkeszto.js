import React from "react";
import UjAllomas from "./UjAllomas";
import { Container, Row, Col } from "react-bootstrap";

function MegalloSzerkeszto(props) {
  console.log(props.megallok);

  if (!props.megallok) return null;

  return (
    <Container>
      <Row>
        {Object.entries(props.megallok).map(([key, value], index) => {
          return (
            <Col>
              {console.log(value.megallok)}
              {value.megallok.map((allomas, index) => {
                return <div key={index}>{allomas.allomas}</div>;
              })}
              <UjAllomas />
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default MegalloSzerkeszto;
