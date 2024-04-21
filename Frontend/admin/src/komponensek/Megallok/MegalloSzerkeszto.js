import React, { useContext } from "react";
import { Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { DragDropContext } from "react-beautiful-dnd";
import { MetaadatContext } from "../../context/Alap/MetaadatContext";
import { MegallokContext } from "../../context/Megallok/MegallokContext";
import MegalloDnD from "./MegalloDnD";
import UjVonal from "./UjVonal";
import SzinkronizaloGomb from "./SzinkronizaloGomb";
import MentesOffcanvas from "./MentesOffcanvas";
import _ from "lodash";

/**
 * @module MegalloSzerkeszto
 * @description `MegalloSzerkeszto` egy React komponens, amely egy űrlapot renderel a "megallok" kezelésére.
 * A komponens megvalósítja a drag-and-drop funkcionalitást a megállók átrendezéséhez, valamint a megállók megfordításához.
 * Továbbá rendelkezik egy szinkronizáló gombbal is, amely a megállók szinkronizálását teszi lehetővé.
 * Így ha a felhasználó megváltoztatja az egyik irányú megállókat, akkor a másik irányú megállók is megváltoznak.
 * Az adatokat egy felugró ablakban lehet menteni, vagy esetleg visszaállítani, az előző állapotra.
 *
 * @component
 * @param {Object} props - A komponens propsa.
 * @param {Object} props.meta - Azokat az infókat tartalmazza, amihez szükséges egy új vonal létrehozásához.
 * Ez azért kell, ha esetleg a felhasználó új vonalat akar létrehozni, de még nincs se oda, se vissza vonala, akkor a meta objektum segítségével ezeket a vonalakat létre tudja hozni.
 *
 * @returns {React.Element} Egy űrlapot, amely a megállók kezelésére szolgál.
 */
function MegalloSzerkeszto({ meta }) {
  const { kulsoAdatok } = useContext(MetaadatContext);
  const { megallok, setMegallok, oppositeKey, megfordit, checked } =
    useContext(MegallokContext);

  /**
   * @description A `handleDragEnd` egy függvény, amely a drag-and-drop műveletet kezeli.
   * Frissíti a megállók sorrendjét és ha kell akkor az elöző megállókat is.
   * Továbbá a `checked` (a szinkronizálás be van-e kapcsolva) állapotától függően tökrözi a megállókat fordított sorrendben.
   * Tehát ha a szinkronizálás be van kapcsolva, akkor a megállók sorrendje is megfordul..
   * @memberof MegalloSzerkeszto
   * @param {Object} result Az eredmény objektum a react-beautiful-dnd onDragEnd eseményéből.
   * @param {Object} result.source Egy objektum, amely leírja a drag művelet forrását.
   * @param {string} result.source.droppableId A forrás droppable ID-je.
   * @param {number} result.source.index A forrás draggable indexe a droppable-on belül.
   * @param {Object} result.destination Egy objektum, amely leírja a drag művelet célját.
   * @param {string} result.destination.droppableId A cél droppable ID-je.
   * @param {number} result.destination.index Az index, ahol a draggable-t a droppable-on belül eldobták.
   */
  const handleDragEnd = (result) => {
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
      [oppositeKey(sourceDroppableId)]: checked
        ? {
            ...prevMegallok[oppositeKey(sourceDroppableId)],
            megallok: megfordit(_.cloneDeep(sourceAllomasok).reverse()),
          }
        : prevMegallok[oppositeKey(sourceDroppableId)],
    }));
  };

  const renderMegallok = () =>
    Object.entries(megallok).map(([key, value]) => (
      <Col>
        {value ? (
          <MegalloDnD name={key} value={value} />
        ) : (
          <UjVonal
            name={key}
            masikVonal={megallok[oppositeKey(key)]?.vonal ?? {}}
            meta={meta}
          />
        )}
      </Col>
    ));

  if (!megallok || !kulsoAdatok?.Allomasok) return null;

  return (
    <Form
      className="container megallo-oldal-form"
      style={{ marginBottom: "80px" }}
    >
      {/*kys */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Row>{renderMegallok()}</Row>
        <SzinkronizaloGomb/>
      </DragDropContext>
      <MentesOffcanvas />
    </Form>
  );
}

export default MegalloSzerkeszto;
