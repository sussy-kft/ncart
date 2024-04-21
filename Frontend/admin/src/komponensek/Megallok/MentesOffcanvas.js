import React, { useContext } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import { MegallokContext } from "../../context/Megallok/MegallokContext";
import { AxiosContext } from "../../context/Alap/AxiosContext";
import { MetaadatContext } from "../../context/Alap/MetaadatContext";
import _ from "lodash";

/**
 * @description `MentesOffcanvas` egy React komponens, amely egy offcanvas UI elemet jelenít meg.
 * Ez a komponens a mentetlen változtatások állapotát kezeli és lehetőséget biztosít ezek elvetésére vagy mentésére.
 * @component
 * @module MentesOffcanvas
 * @returns {React.Element} Egy offcanvas UI elemet, amely akkor jelenik meg, ha vannak nem mentett változtatások.
 * Két gombot tartalmaz: egyet a változtatások elvetéséhez és egyet a változtatások mentéséhez.
 *
 */
function MentesOffcanvas(){
  const { put } = useContext(AxiosContext);
  const { url } = useContext(MetaadatContext);
  const { megallok, setMegallok, regiMegallok, setRegiMegallok, show, setShow, setChecked } = useContext(MegallokContext);
  
  /**
   * @memberof MentesOffcanvas
   * @description `kuldes` egy aszinkron függvény, amely elküldi a `megallok` aktuális állapotát.
   * A post művelet után beállítja a `regiMegallok` értékét a `megallok` aktuális állapotára, és elrejti az offcanvas UI-t.
   */
  const kuldes = async () => {
    for (const value of Object.values(megallok)) {
      if (value) {
        await put(`${url}/batch`, {
          vonal: value.vonal.id,
          kezdoAll: value.megallok[0].elozoMegallo,
          megallok: value.megallok,
        });
        setRegiMegallok(_.cloneDeep(megallok));
        setShow(false);
      }
    }
  };

  /**
   * @memberof MentesOffcanvas
   * @description `visszaallit` egy olyan függvény, amely visszaállítja a `megallok` állapotát a `regiMegallok` állapotára, és viszaállítja a szinronizáló gombot, majd elrejti az off-canvas UI-t.
   */
  const visszaallit = () => {
    setChecked(false);
    setShow(false);
    setMegallok(_.cloneDeep(regiMegallok));
  };

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