import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import deleteImage from "../../media/delete.gif";
import { useContext } from "react";
import { AxiosContext } from "../../context/Alap/AxiosContext";
import { MetaadatContext } from "../../context/Alap/MetaadatContext";
import text from "../../media/delete";

/**
 * @module PopUpPanel
 * @description A PopUpPanel egy React komponens, ami a bootstrap {@link Modal} komponensét használja egy törlési megerősítő ablak megjelenítésére.
 * Az AxiosContextet használja, hogy az adatot a szerverről törölje és a MetaadatContextet a URL meghatározására, hogy melyik táblából kell letörölni az adatot.
 * 
 * @param {Object} props - A komponens propsa.
 * @param {string} props.id - Az adott elem ID-ja, ez alapján tudja, hogy a szerver melyik elemet törölje.
 * @param {boolean}  props.show - Ez jelzi, hogy a modal megjelenjen-e vagy sem.
 * @param {Function}  props.handleClose - Egy callback függvény, ami meghívódik, amikor a modal bezáródik.
 * The function to be called when the modal is closed.
 * 
 * @returns {JSX.Element} Egy bootstrap modal komponenst, ami egy törlési megerősítő ablakot jelenít meg.
 */
function PopUpPanel({ id, show, handleClose }) {
  const { destroy } = useContext(AxiosContext);
  const { url } = useContext(MetaadatContext);

  /**
   * @description A törlési folyamatot indítja el.
   * @memberof PopUpPanel
   */
  const handleDelete = () => {
    destroy(url, id);
    handleClose();
  };

  return (
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Biztosam törölni akarsz?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h2>A törlés nem vonható vissza!</h2>
          <img
            src={deleteImage}
            className="rounded me-2"
            alt={text}
            title={text}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Mégse
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Törlés
          </Button>
        </Modal.Footer>
      </Modal>  
  );
}

export default PopUpPanel;
