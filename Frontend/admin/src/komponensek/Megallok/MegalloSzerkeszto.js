import React, { useContext } from "react";
import { MetaadatContext } from "../../context/MetaadatContext";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Row } from "react-bootstrap";
import AllomasKartya from "./AllomasKartya";
import UjAllomas from "./UjAllomas";

/**
 *
 * @component
 * @param {Object} value - Az adot vonal megállóit tartalmazó objektum.
 * @param {string} name - A vonal íránya. (oda vagy vissza)
 * @param {Function} handleChange - Egy callback függvény, amely kezeli az állomások változását.
 * @param {Function} handleSave - Egy callback függvény, amely kezeli a mentést.
 * @param {Function} torol - Egy callback függvény, amely kezeli az állomások törlését.
 * @param {Object} megallok - Egy objektum, ami az oda és vissza irányú megállókat tartalmazza.
 * @param {Function} atmasol - Egy callback függvény, amely átmásolja az adatokat, a másik megállóba.
 * @param {Function} filterPool - Function to filter the pool.
 * @returns {JSX.Element} Egy Drag and Drop komponens, hol a megállókat lehet szerkeszteni.
 */
function MegalloSzerkeszto( { value, name, handleChange, handleSave, torol, megallok, atmasol, filterPool,  } ) {

  const { kulsoAdatok, createOppositeKey } = useContext(MetaadatContext);

  const OppositeKey = createOppositeKey(megallok);

  /**
   *
   * @param {Object} allomas - Az az egy megálló, amit meg kell jeleníteni.
   * @param {number} index - Egy index, ami segít megkülönböztetni a megállókat.
   * @returns {JSX.Element} Egy Draggable komponenst.
   * @function
   */
  const renderDraggable = (allomas, index) => (
    <Draggable key={`${name}-${allomas.allomas}-${index}`} draggableId={`${name}-${allomas.allomas}-${index}`} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <AllomasKartya
            allomas={allomas}
            nev={kulsoAdatok.Allomasok.find((val) => val.id === allomas.allomas)?.nev}
            torol={value.megallok.length > 1 ? torol.bind(this, name) : null}
            handleChange={handleChange.bind(this, name)}
          />
        </div>
      )}
    </Draggable>
  );

  if(!kulsoAdatok?.Allomasok) return null;

  return (
    <>
      <h3>{`vonal: ${value.vonal.id}`}</h3>
      <h4>Kezdőállomás: {value.megallok[0].elozoMegallo}</h4>
      <Droppable droppableId={name} type={name}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {value.megallok.map(renderDraggable)}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <UjAllomas handleSave={handleSave.bind(null, name)} pool={filterPool(name)} />
      {megallok[OppositeKey(name)] && (
        <Row className="m-0 ">
          <Button  variant="primary" onClick={() => atmasol(name)}>Adatok átmásolása</Button>
        </Row>
      )}
    </>
  );
}

export default MegalloSzerkeszto;