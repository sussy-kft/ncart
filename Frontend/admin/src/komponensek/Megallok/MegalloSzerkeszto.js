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
import { Offcanvas } from "react-bootstrap";
import UjVonal from "./UjVonal";

function MegalloSzerkeszto(props) {
  const { getAll, post, patch } = useContext(AxiosContext);
  const { url } = useContext(MetaadatContext);

  const [opcio, setOpciok] = React.useState(null);
  const [megallok, setMegallok] = React.useState(props.megallok);
  const [regiMegallok, setRegiMegallok] = React.useState(
    JSON.parse(JSON.stringify(props.megallok))
  );
  const [checked, setChecked] = useState(false);
  const [show, setShow] = useState(false);

  const _ = require("lodash");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  console.log("bbbbbbbbbbbbb", megallok, regiMegallok);

  const filterPool = (key) => {
    // console.warn(opcio);
    // console.error(megallok[key].megallok);
    if (!opcio) return null;
    return opcio.filter((value) => {
      //console.log(!megallok[key].megallok.some(val2 => {return value.id == val2.allomas}));
      return !(
        value.id == megallok[key].megallok[0]?.elozoMegallo ||
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

  const handleChange = (key, obj, event) => {
    setShow(true);
    const tmp = [...megallok[key].megallok];
    const { name, value } = event.target;

    tmp.find((val) => val.allomas == obj.allomas).hanyPerc = value * 1;
    // console.log(megallok[key].megallok.hanyPerc);
    // console.log(regiMegallok[key].megallok.hanyPerc);
    // console.warn(regiMegallok);
    console.warn(value);
    console.warn(megallok, regiMegallok);
    setMegallok((prevMegallok) => ({
      ...prevMegallok,
      [key]: {
        ...prevMegallok[key],
        megallok: tmp,
      },
      
        ...(checked
          ? {
              [OppositeKey(key)]: {
                ...prevMegallok[OppositeKey(key)],
                megallok: megfordit(
                  JSON.parse(JSON.stringify(tmp)).reverse()
                ),
              },
            }
          : {}),
      
    }));
  };

  const handleSave = (event, obj, key, callback, a) => {
    event.preventDefault();
    let tmp = {};
    tmp["allomas"] = obj["id"] * 1;
    tmp["hanyPerc"] = obj["ido"] * 1;
    tmp["elozoMegallo"] =
      megallok[key].megallok[megallok[key].megallok.length - 1].allomas;
    tmp["vonal"] = megallok[key].megallok[0].vonal;

    setMegallok((prevMegallok) => ({
      ...prevMegallok,
      [key]: {
        ...prevMegallok[key],
        megallok: [...prevMegallok[key].megallok, tmp],
      },

      ...(checked
        ? {
            [OppositeKey(key)]: {
              ...prevMegallok[OppositeKey(key)],
              megallok: megfordit([
                JSON.parse(JSON.stringify(tmp)),
                ...JSON.parse(JSON.stringify(megallok[key].megallok)).reverse(),
              ]),
            },
          }
        : {}),
    }));
    if (a) callback({ target: { name: "id", value: a.id } });
  };

  const kuldes = () => {
    for (const [key, value] of Object.entries(megallok)) {
      console.warn(
        value,
        value.megallok.filter((val, index) => {
          return (
            index != 0 &&
            !regiMegallok[key].megallok.some((val2) => {
              return val.allomas == val2.allomas;
            })
          );
        })
      );
      // patch("vonalak", value.vonal.id, {
      //   vonalSzam: value.vonal.vonalSzam,
      //   jarmuTipus: value.vonal.jarmuTipus,
      //   kezdoAll: value.megallok[0].elozoMegallo,
      //   vegall: value.megallok[value.megallok.length - 1].allomas,
      // })
      // post(url + "/batch", {
      //   vonal: value.vonal.id,
      //   megallok: value.megallok.filter((val) => {
      //     return !regiMegallok[key].megallok.some((val2) => {
      //       return val.allomas == val2.allomas;

      //       // console.log("gbtwejipgwejöiiowho9uigbhretoüb", val);
      //       // return !val.some((val2) => {
      //       // //console.log("sus",value.id, val2.allomas)
      //       // return val.allomas == val2.allomas;
      //     });
      //   }),
      //});

      // updateData(value, key);
    }

    console.warn("Küldés");
  };

  // async function updateData(value, key) {
  //   const copy = JSON.parse(JSON.stringify(value.megallok));
  //   function patchPromise() {
  //     return new Promise((resolve, reject) => {
  //       try {
  //         patch("vonalak", value.vonal.id, {
  //           vonalSzam: value.vonal.vonalSzam,
  //           jarmuTipus: value.vonal.jarmuTipus,
  //           kezdoAll: copy[0].elozoMegallo,
  //           vegall: copy[copy.length - 1].allomas,
  //         });
  //         resolve();
  //       } catch (error) {
  //         reject(error);
  //       }
  //     });
  //   }

  //   patchPromise()
  //     .then(() => {
  //       if (copy[1]) {
  //         return post(url, {
  //           elozoMegallo: copy[0].elozoMegallo,
  //           hanyPerc: copy[1].hanyPerc,
  //           vonal: value.vonal.id,
  //           allomas: copy[1].elozoMegallo,
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  const atmasol = (key) => {
    console.warn(OppositeKey(key));
    let tmp = JSON.parse(JSON.stringify(megallok[key].megallok));
    tmp.reverse();
    megfordit(tmp);

    // console.log("tmp", tmp);
    setMegallok((prevMegallok) => ({
      ...prevMegallok,
      [OppositeKey(key)]: {
        ...prevMegallok[key],
        megallok: tmp,
      },
    }));
  };

  const megfordit = (lista) => {
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
    return megallok.oda && megallok.vissza && (
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

  const visszaallit = () => {
    setChecked(false);
    handleClose();
    setMegallok(JSON.parse(JSON.stringify(regiMegallok)));
    console.log(megallok, regiMegallok);
  };

  const torol = (key, obj) => {
    let index = megallok[key].megallok.findIndex(
      (value) => JSON.stringify(value) === JSON.stringify(obj)
    );
    if(index > 0 && index < megallok[key].megallok.length - 1)
      megallok[key].megallok[index+1].elozoMegallo = megallok[key].megallok[index -1 ].allomas;
    const tmp = megallok[key].megallok.filter(
      (value) => JSON.stringify(value) !== JSON.stringify(obj)
    )
    setMegallok((prevMegallok) => ({
      ...prevMegallok,
      [key]: {
        ...prevMegallok[key],
        megallok: tmp,
      },
      ...(checked
        ? {
            [OppositeKey(key)]: {
              ...prevMegallok[OppositeKey(key)],
              megallok: megfordit(
                JSON.parse(JSON.stringify(tmp)).reverse()
              ),
            },
          }
        : {}),
    }));
  };

  React.useEffect(() => {
    getAll("allomasok", setOpciok);
  }, []);

  React.useEffect(() => {
    setShow(!_.isEqual(megallok, regiMegallok));
  }, [megallok]);

  if (!megallok || !opcio) return null;

  return (
    <>
      <Form className="container">
        {/* kys */}

        <DragDropContext
          onDragEnd={(result) => {
            const { source, destination } = result;
            if (!destination || source.index === destination.index) return;

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
            else
              sourceAllomasok[destination.index].elozoMegallo = a.elozoMegallo;
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
              
              console.log(value);
              if (!value)
                return (
                  <Col>

                    <UjVonal name={key} masikVonal={megallok[OppositeKey(key)].vonal} setMegallok={setMegallok} setRegiMegallok={setRegiMegallok} megallok={megallok}/>
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
                            draggableId={
                              key + "-" + allomas.allomas + "-" + index
                            }
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <AllomasKartya
                                  name={key}
                                  allomas={allomas}
                                  torol={
                                    value.megallok.length > 1 ? torol : null
                                  }
                                  handleChange={handleChange.bind(this, key)}
                                />
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
              // console.log(e.currentTarget.checked);
            }}
            {...{ disabled: !szinkronizalhato() }}
          >
            Sinkronizálás {checked ? "kikapcsolása" : "bekopcsolása"}
          </ToggleButton>
          {/* <Button variant="primary" onClick={}>
          Mentés
        </Button> */}
        </DragDropContext>
      </Form>

      <Offcanvas
        style={{ height: "70px" }}
        show={show}
        onHide={handleClose}
        placement="bottom"
        scroll={true}
        backdrop={false}
        keyboard={false}
      >
        <Offcanvas.Header>
          <Offcanvas.Title className="w-100">
            <div className="d-flex justify-content-between">
              <span>Nem mentet változtatások vannak</span>
              <div
                style={{ width: "170px", marginRight: "3vw" }}
                className="d-flex justify-content-between"
              >
                <Button variant="secondary" onClick={visszaallit}>
                  Mégse
                </Button>
                <Button variant="success" onClick={kuldes}>
                  Mentés
                </Button>
              </div>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
      </Offcanvas>
    </>
  );
}

export default MegalloSzerkeszto;
