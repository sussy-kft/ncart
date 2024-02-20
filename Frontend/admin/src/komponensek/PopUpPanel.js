
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import deleteImage from '../delete.gif';
import { InfoPanelContext } from '../context/InfoPanelContext';
import { useContext } from 'react';

function PopUpPanel(props) {
  const addpanel = useContext(InfoPanelContext);
  
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
          <Button variant="danger" onClick={() => {props.a(props.url, props.getId(), addpanel, addpanel); props.handleClose()}}>
            Törlés
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PopUpPanel;