import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';

/**
 * A `react-bootstrap` komponensével készített {@link Toast} komponens, ami egy üzenetet jelenít meg a felhasználónak.
 * Ez arra alkalmas, hogy a felhasználó értesítéseket kapjon a weboldalon, hogyha valami történik a háttérben és visszajelzést szeretnénk neki küldeni.
 * 5s után automatikusan eltűnik. 
 *
 * @param {Object} props - A komponens propsa.
 * @param {string} props.bg - A háttérszín a Toastnak. (A Bootstrap színeit használja)
 * @param {string} props.text - A szöveg, amit a Toastban megjelenít.
 *
 * @returns {JSX.Element} Egy Toast komponenst.
 */
function InfoPanel({ bg, text }) {
    const [show, setShow] = useState(true);
  
    return ( 
    <Toast bg={bg} onClose={() => setShow(false)} show={show} delay={5000} autohide>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Ncart: újratervezés</strong>
            <small>Most</small>
          </Toast.Header>
          <Toast.Body className='text-white'>{text}</Toast.Body>
    </Toast>
  );
}

export default InfoPanel;