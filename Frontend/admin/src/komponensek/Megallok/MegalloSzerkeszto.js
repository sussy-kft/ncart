import React, { useEffect } from "react";
import UjAllomas from "./UjAllomas";
import { Container, Row, Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useContext } from "react";
import { AxiosContext } from "../../context/AxiosContext";
import { MetaadatContext } from "../../context/MetaadatContext";
import { useState } from "react";
import { ToggleButton } from "react-bootstrap";
import AllomasKartya from "./AllomasKartya";

function MegalloSzerkeszto(props) {
  const { getAll, post } = useContext(AxiosContext);
  const { url } = useContext(MetaadatContext);

  const [opcio, setOpciok] = React.useState(null);
  const [megallok, setMegallok] = React.useState(props.megallok);
  const [checked, setChecked] = useState(false);

  console.log(checked);

  const filterPool = (key) => {
    // console.warn(opcio);
    // console.error(megallok[key].megallok);
    if (!opcio) return null;
    return opcio.filter((value) => {
      //console.log(!megallok[key].megallok.some(val2 => {return value.id == val2.allomas}));
      return !(
        value.id == megallok[key].megallok[0].elozoMegallo ||
        megallok[key].megallok.some((val2) => {
          //console.log("sus",value.id, val2.allomas)
          return value.id == val2.allomas;
        })
      );
    });
  };

  const OppositeKey = (key) => {
    return Object.keys(megallok).filter((k) => k !== key)[0];
  };

  const handleSave = (event, obj, key, callback, a) => {
    event.preventDefault();
    console.log(megallok);
    let tmp = {};
    tmp["allomas"] = obj["id"] * 1;
    tmp["hanyPerc"] =
      obj["ido"].split(":")[0] * 60 + obj["ido"].split(":")[1] * 1;
    tmp["elozoMegallo"] =
      megallok[key].megallok[megallok[key].megallok.length - 1].allomas;
    tmp["vonal"] = megallok[key].megallok[0].vonal;

    setMegallok((prevMegallok) => ({
      ...prevMegallok,
      [key]: {
        ...prevMegallok[key],
        megallok: [...prevMegallok[key].megallok, tmp],
      },
      // ...(checked
      //   ? {
      //       [OppositeKey(key)]: {
      //         ...prevMegallok[OppositeKey(key)],
      //         megallok: [tmp, ...prevMegallok[OppositeKey(key)].megallok],
      //       },
      //     }
      //   : {}),

      ...(checked
        ? {
            [OppositeKey(key)]: {
              ...prevMegallok[OppositeKey(key)],
              megallok: megfordit([JSON.parse(JSON.stringify(tmp)), ...JSON.parse(JSON.stringify(megallok[(key)].megallok)).reverse()]),
            },
          }
        : {}),

    }));
    if (a) callback({ target: { name: "id", value: a.id } });
  };

  const kuldes = () => {
    console.log(megallok);
    for (const [key, value] of Object.entries(megallok)) {
      post(url + "/batch", { vonal: value.vonal.id, megallok: value.megallok });
    }
    console.warn("Küldés");
  };

  const atmasol = (key) => {
    console.warn(OppositeKey(key));
    let tmp = JSON.parse(JSON.stringify(megallok[key].megallok));
    tmp.reverse();
    megfordit(tmp);

    console.log("tmp", tmp);
    setMegallok((prevMegallok) => ({
      ...prevMegallok,
      [OppositeKey(key)]: {
        ...prevMegallok[key],
        megallok: tmp,
      },
    }));
  };

  const megfordit = (lista) => {
    // Create a copy of the array
    let copy = [...lista];
  
    for (let ix = 0; ix < copy.length; ix++) {
        [copy[ix].allomas, copy[ix].elozoMegallo] = [
          copy[ix].elozoMegallo,
          copy[ix].allomas,
        ];
    }
  
    console.error("megfordit", copy);
    return copy;
  };

  const szinkronizalhato = () => {
    //console.error(megallok);
    return (
      megallok.oda.megallok.length === megallok.vissza.megallok.length &&
      megallok.oda.megallok.every(
        (value, index) =>
          value.allomas ===
            megallok.vissza.megallok[
              megallok.vissza.megallok.length - index - 1
            ].elozoMegallo &&
          value.elozoMegallo ===
            megallok.vissza.megallok[
              megallok.vissza.megallok.length - index - 1
            ].allomas
      )
    );
  };

  React.useEffect(() => {
    getAll("allomasok", setOpciok);
  }, []);

  if (!megallok || !opcio) return null;

  return (
    <Form>
      {/* kys */}

      <DragDropContext
        onDragEnd={(result) => {
          const { source, destination } = result;
          if (!destination) return;
          if (source.index === destination.index) return;

          const sourceDroppableId = source.droppableId;
          const sourceAllomasok = [...megallok[sourceDroppableId].megallok];
          const a = { ...sourceAllomasok[0] };
          const [removed] = sourceAllomasok.splice(source.index, 1);

          sourceAllomasok.splice(destination.index, 0, removed);

          if (source.index > 0)
            sourceAllomasok[source.index].elozoMegallo =
              sourceAllomasok[source.index - 1].allomas;
          else {
            sourceAllomasok[source.index].elozoMegallo = removed.elozoMegallo;
          }

          if (source.index < sourceAllomasok.length - 1)
            sourceAllomasok[source.index + 1].elozoMegallo =
              sourceAllomasok[source.index].allomas;

          if (destination.index > 0)
            sourceAllomasok[destination.index].elozoMegallo =
              sourceAllomasok[destination.index - 1].allomas;
          else sourceAllomasok[destination.index].elozoMegallo = a.elozoMegallo;
          if (destination.index < sourceAllomasok.length - 1)
            sourceAllomasok[destination.index + 1].elozoMegallo =
              sourceAllomasok[destination.index].allomas;

          setMegallok((prevMegallok) => ({
            ...prevMegallok,
            [sourceDroppableId]: {
              ...prevMegallok[sourceDroppableId],
              megallok: sourceAllomasok,
            },
            [OppositeKey(sourceDroppableId)]: checked
              ? {
                  ...prevMegallok[OppositeKey(sourceDroppableId)],
                  megallok: megfordit(
                    JSON.parse(JSON.stringify(sourceAllomasok)).reverse()
                  ),
                }
              : prevMegallok[OppositeKey(sourceDroppableId)],
          }));
        }}
      >
        <Row>
          {Object.entries(megallok).map(([key, value], index) => {
            //console.log(key);
            if (!value)
              return (
                <Col>
                  <UjAllomas />
                </Col>
              );
            return (
              <Col>
                <Droppable droppableId={key} type={key}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {value.megallok.map((allomas, index) => (
                        <Draggable
                          key={key + "-" + allomas.allomas + "-" + index}
                          draggableId={key + "-" + allomas.allomas + "-" + index}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <AllomasKartya allomas={allomas} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <UjAllomas
                  handleSave={handleSave}
                  name={key}
                  pool={filterPool(key)}
                />
                <Row>
                  <Button variant="primary" onClick={() => atmasol(key)}>
                    Adatok átmásolása
                  </Button>
                </Row>
              </Col>
            );
          })}
        </Row>
        <ToggleButton
          id="toggle-check"
          type="checkbox"
          variant={checked ? "success" : "outline-warning"}
          onMouseOver={(e) =>
            (e.target.className = checked
              ? "btn btn-danger"
              : "btn btn-success")
          }
          onMouseLeave={(e) =>
            (e.target.className = checked
              ? "btn btn-warning"
              : "btn btn-outline-warning")
          }
          checked={checked}
          onChange={(e) => {
            setChecked(e.currentTarget.checked);
            console.log(e.currentTarget.checked);
          }}
          {...{ disabled: !szinkronizalhato() }}
        >
          Sinkronizálás {checked ? "kikapcsolása" : "bekopcsolása"}
        </ToggleButton>
        <Button variant="primary" onClick={kuldes}>
          Mentés
        </Button>
      </DragDropContext>
    </Form>
  );
}

export default MegalloSzerkeszto;
