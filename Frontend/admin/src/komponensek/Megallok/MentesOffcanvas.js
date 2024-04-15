import React from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";

/**
 * 
 * @component
 * @param {boolean} show - Az állapot, hogy megjelenjen-e az offcanvas.
 * @param {Function} setShow - Egy függvény, ami beállítja az offcanvas megjelenését.
 * @param {Function} visszaallit - Egy callback függvény, ami lefut, ha a "Mégse" gombra kattintanak.
 * @param {Function} kuldes - Egy callback függvény, ami lefut, ha a "Mentés" gombra kattintanak.
 * 
 * @example
 * <MentesOffcanvas show={true} setShow={setShow} visszaallit={visszaallit} kuldes={kuldes} />
 * 
 * @returns {React.Element} MentesOffcanvas komponenst.
 */
function MentesOffcanvas({show, setShow, visszaallit, kuldes}){
    return (
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
    );
}

export default MentesOffcanvas;