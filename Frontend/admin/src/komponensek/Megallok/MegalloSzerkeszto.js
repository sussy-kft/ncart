import React from "react";
import UjAllomas from "./UjAllomas";
import { Row, Col, Button } from "react-bootstrap";
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
  const _ = require("lodash");
  
  const { getAll, post } = useContext(AxiosContext);
  const { url } = useContext(MetaadatContext);

  const [opcio, setOpciok] = React.useState(null);
  const [megallok, setMegallok] = React.useState(props.megallok);
  const [regiMegallok, setRegiMegallok] = React.useState(
    _.cloneDeep(props.megallok)
  );
  const [checked, setChecked] = useState(false);
  const [show, setShow] = useState(false);

  const filterPool = (key) => {
    if (!opcio) return null;

    return opcio.filter((value) => {
      return !(
        value.id === megallok[key].megallok[0]?.elozoMegallo ||
        megallok[key].megallok.some((val2) => {
          return value.id === val2.allomas;
        })
      );
    });
  };

  const OppositeKey = key => Object.keys(megallok).filter((k) => k !== key)

  const handleChange = (key, obj, event) => {
    setShow(true);
    const tmp = [...megallok[key].megallok];
    const { value } = event.target;

    tmp.find((val) => val.allomas === obj.allomas).hanyPerc = value * 1;
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
              megallok: megfordit(JSON.parse(JSON.stringify(tmp)).reverse()),
            },
          }
        : {}),
    }));
  };

  const handleSave = (key, event, obj, callback, a) => {
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
      if (value) {
        // console.warn("meg", megallok);
        post(url + "/batch", {
          vonal: value.vonal.id,
          kezdoAll: value.megallok[0].elozoMegallo,
          megallok: value.megallok,
        });
        setRegiMegallok(_.cloneDeep(megallok));
        setShow(false);
      }
    }

    console.warn("Küldés");
  };

  const atmasol = (key) => {

    let tmp = JSON.parse(JSON.stringify(megallok[key].megallok));
    tmp.reverse();
    megfordit(tmp);

    setMegallok((prevMegallok) => ({
      ...prevMegallok,
      [OppositeKey(key)]: {
        megallok: tmp,
        vonal: _.cloneDeep(prevMegallok[OppositeKey(key)].vonal),
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
    const { oda, vissza } = megallok;

    return (
      oda &&
      vissza &&
      oda.megallok.length === vissza.megallok.length &&
      oda.megallok.every(
        (value, index) =>
          value.allomas ===
            vissza.megallok[
              vissza.megallok.length - index - 1
            ].elozoMegallo &&
          value.elozoMegallo ===
            vissza.megallok[
              vissza.megallok.length - index - 1
            ].allomas
      )
    );
  };

  const visszaallit = () => {
    setChecked(false);
    setShow(false);
    setMegallok(JSON.parse(JSON.stringify(regiMegallok)));
  };

  const torol = (key, obj) => {
    let index = megallok[key].megallok.findIndex(
      (value) => JSON.stringify(value) === JSON.stringify(obj)
    );
    if (index > 0 && index < megallok[key].megallok.length - 1)
      megallok[key].megallok[index + 1].elozoMegallo =
        megallok[key].megallok[index - 1].allomas;
    const tmp = megallok[key].megallok.filter(
      (value) => JSON.stringify(value) !== JSON.stringify(obj)
    );
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
              megallok: megfordit(JSON.parse(JSON.stringify(tmp)).reverse()),
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
      <Form className="container" style={{ marginBottom: "80px" }}>
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
              console.warn(value);
              if (!value)
                return (
                  <Col>
                    <UjVonal
                      name={key}
                      masikVonal={megallok[OppositeKey(key)]?.vonal ?? {}}
                      meta={props.meta}
                      setMegallok={setMegallok}
                      setRegiMegallok={setRegiMegallok}
                      megallok={megallok}
                    />
                  </Col>
                );
              return (
                <Col>
                  <h3>{`${value.vonal.id} vonal:`}</h3>
                  {/* most csak a kezdőállomást írja ki statikusan*/}
                  <h4>Kezdőállomás: {value.megallok[0].elozoMegallo}</h4>
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
                                  allomas={allomas}
                                  torol={
                                    value.megallok.length > 1 ? torol.bind(this, key) : null
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
                    handleSave={handleSave.bind(null, key)}
                    pool={filterPool(key)}
                  />
                  {megallok[OppositeKey(key)] && (
                    <Row>
                      <Button variant="primary" onClick={() => atmasol(key)}>
                        Adatok átmásolása
                      </Button>
                    </Row>
                  )}
                </Col>
              );
            })}
          </Row>
          <ToggleButton
            id="toggle-check"
            className={megallok.vissza ? "" : "d-none"}
            type="checkbox"
            variant={checked ? "success" : "warning"}
            onMouseOver={(e) =>
              (e.target.className = checked
                ? "btn btn-danger"
                : "btn btn-success")
            }
            onMouseLeave={(e) =>
              (e.target.className = checked
                ? "btn btn-warning"
                : "btn btn-warning")
            }
            checked={checked}
            onChange={(e) => {
              setChecked(e.currentTarget.checked);
            }}
            {...{ disabled: !szinkronizalhato() }}
          >
            Sinkronizálás {checked ? "kikapcsolása" : "bekopcsolása"}
          </ToggleButton>
        </DragDropContext>
      </Form>

      <Offcanvas
        style={{ height: "70px" }}
        show={show}
        onHide={() => setShow(false)}
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
