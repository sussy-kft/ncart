
import React from 'react';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import deleteImage from '../delete.gif';
import InfoPanel from './InfoPanel';

function PopUpPanel(props) {
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
          <Button variant="danger" onClick={() => {torles(props.url, props.getId()); props.handleClose()}}>
            Törlés
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function torles(url, id) {
  
    Axios.delete("https://localhost:44339/"+ url + "/" + id)
      .then((response) => {
        <InfoPanel text={response.data}/>
      })
      .catch((error) => {
        <InfoPanel text={error.message}/>
      });
}
export default PopUpPanel;