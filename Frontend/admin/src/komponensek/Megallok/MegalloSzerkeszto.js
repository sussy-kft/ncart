import React from "react";
import UjAllomas from "./UjAllomas";
import { Container, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function MegalloSzerkeszto(props) {
  console.log(props.megallok);

  const [megallok, setMegallok] = React.useState(props.megallok);

  const handleSave = (event, obj) => {
    event.preventDefault();
    console.log(megallok);
    let tmp = {}
    tmp["allomas"] = obj["id"];
    tmp["hanyPerc"] = obj["ido"];
    tmp["elozoMegallo"] = megallok.oda.megallok[megallok.oda.megallok.length - 1].allomas;
    tmp["vonal"] = megallok.oda.megallok[0].vonal;
    setMegallok(prevMegallok => ({
      ...prevMegallok,
      oda: {
        ...prevMegallok.oda,
        megallok: [...prevMegallok.oda.megallok, tmp]
      }
    }));
  };
  if (!megallok) return null;

  return (
    <Form>
      
      <Row>
        {Object.entries(megallok).map(([key, value], index) => {
          if (!value) return <Col><UjAllomas /></Col>
          return (
            <Col>
              {console.log(value.megallok)}
              {
                value.megallok.map((allomas, index) => {
                  return <div key={`${allomas.allomas}-${index}`}>{allomas.allomas}</div>
                })
              }
              <UjAllomas handleSave={handleSave}/>
            </Col>
          )
        })}
      </Row>
    </Form>
  );
}

export default MegalloSzerkeszto;
