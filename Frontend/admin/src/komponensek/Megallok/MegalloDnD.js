import React, { useContext } from "react";
import { MetaadatContext } from "../../context/Alap/MetaadatContext";
import { MegallokContext } from "../../context/Megallok/MegallokContext";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Row } from "react-bootstrap";
import AllomasKartya from "./AllomasKartya";
import UjAllomas from "./UjAllomas";
import _ from "lodash";

/**
 * @description `MegalloDnD` egy olyan komponens, ami lehetővé teszi a megállók szerkesztését egy drag and drop felületen.
 * @module MegalloDnD
 * @component
 * @param {string} name - A vonal neve. (oda vagy vissza)
 *
 * @returns {JSX.Element} Egy Drag and Drop komponenst, ahol a megállók szerkeszthetőek.
 */
function MegalloDnD({ name }) {
  const { kulsoAdatok } = useContext(MetaadatContext);
  const { megallok, oppositeKey, atmasol } = useContext(MegallokContext);

  const allomasId = megallok[name].megallok[0]?.elozoMegallo;

  /**
   * @description A `filterPool` egy függvény, ami kiszűri azokat a megállókat, amelyek még nem szerepelnek a vonalban.
   * @memberof MegalloDnD
   * @function
   * @param {string} key - A vonal kulcsa, hogy oda vagy vissza vonalról van-e szó.
   * @returns {Array|null} A szűrt megállók tömbje, vagy null, ha nincsenek már más megállók.
   */
  const filterPool = (key) => {
    if (!kulsoAdatok.Allomasok) return null;

    return kulsoAdatok.Allomasok.filter((value) => {
      return !(
        value.id === megallok[key].megallok[0]?.elozoMegallo ||
        megallok[key].megallok.some((val2) => {
          return value.id === val2.allomas;
        })
      );
    });
  };

  /**
   * @description A `renderDraggable` egy függvény, ami egy Draggable komponenst jeleníti meg.
   * @param {Object} allomas - Az az egy megálló, amit meg kell jeleníteni.
   * @param {number} index - Egy index, ami segít megkülönböztetni a megállókat.
   * @returns {JSX.Element} Egy Draggable komponenst.
   * @function
   * @memberof MegalloDnD
   */
  const renderDraggable = (allomas, index) => (
    <Draggable
      key={`${name}-${allomas.allomas}-${index}`}
      draggableId={`${name}-${allomas.allomas}-${index}`}
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
            nev={
              kulsoAdatok.Allomasok.find((val) => val.id === allomas.allomas)
                ?.nev
            }
            irany={name}
          />
        </div>
      )}
    </Draggable>
  );
  if (!kulsoAdatok?.Allomasok || !allomasId) return null;
  return (
    <>
      <h3 className="mb-4">{`vonal: ${megallok[name].vonal.id}`}</h3>
      <Droppable droppableId={name} type={name}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {renderDraggable({ allomas: allomasId }, 0)}
            {megallok[name].megallok.map((allomas, index) =>
              renderDraggable(allomas, index + 1)
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <UjAllomas irany={name} pool={filterPool(name)} />
      {megallok[oppositeKey(name)] && (
        <Row className="m-0 ">
          <Button variant="primary" onClick={() => atmasol(name)}>
            Adatok átmásolása
          </Button>
        </Row>
      )}
    </>
  );
}

export default MegalloDnD;
