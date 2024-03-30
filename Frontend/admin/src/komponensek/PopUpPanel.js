
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import deleteImage from '../media/delete.gif';
import { InfoPanelContext } from '../context/InfoPanelContext';
import { useContext } from 'react';
import { AxiosContext } from '../context/AxiosContext';
import { MetaadatContext } from '../context/MetaadatContext';
import text from '../media/delete';

function PopUpPanel(props) {
  const {addInfoPanel} = useContext(InfoPanelContext);
  const {destroy} = useContext(AxiosContext);
  const {url, getPKs} = useContext(MetaadatContext);

  const a = () => {
    console.log(props.id);
    destroy(url, props.id); 
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
          <img src={deleteImage} className="rounded me-2" alt={text} title={text}/>
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