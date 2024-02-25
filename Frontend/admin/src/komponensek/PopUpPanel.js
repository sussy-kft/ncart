
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import deleteImage from '../media/delete.gif';
import { InfoPanelContext } from '../context/InfoPanelContext';
import { useContext, useId } from 'react';
import { AxiosContext } from '../context/AxiosContext';

function PopUpPanel(props) {
  const {addInfoPanel} = useContext(InfoPanelContext);
  const {destroy} = useContext(AxiosContext);

  const a = () => {
    destroy(props.url, props.id); 
    props.handleClose();
  }

  return (
    <>
      <Modal
        size='lg'
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Biztosam törölni akarsz?</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
          <h2>A törlés nem vonható vissza!</h2>
          <img src={deleteImage} className="rounded me-2" alt="" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Mégse
          </Button>
          <Button variant="danger" onClick={a}>
            Törlés
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PopUpPanel;