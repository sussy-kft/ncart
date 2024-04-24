import React, { useContext } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import InputMezo from "../kozos/InputMezo";
import kep from "../../media/xd.png";
import { MegallokContext } from "../../context/Megallok/MegallokContext";
import _ from "lodash";

/**
 * @module AllomasKartya
 * @description Egy React komponens, ami egy kártyát jelenít meg egy állomás adataival.
 *
 * @param {Object} props - A komponens propsa.
 * @param {Object} props.allomas - Az állomás objektum, ami tartalmazza az állomás adatait.
 * @param {string} props.allomas.allomas - Az állomás ID-ja.
 * @param {number} props.allomas.hanyPerc - Hogy hány percig tart eljutni a következő állomásra.
 * @param {string} props.nev - Az állomás neve.
 * @param {string} props.irany - Egy kulcs, hogy melyik irányhoz tartozik az állomás.
 *
 * @returns {React.Element} Egy React Bootstrap Card komponenst, ami megjeleníti az állomás adatait.
 */
function AllomasKartya({ allomas, nev, irany }) {
  const { megallok, setMegallok, checked, oppositeKey, megfordit, setShow } =
    useContext(MegallokContext);

  /**
   * @description A jelenlegi állomás időtartamát módosítja.
   * @memberof AllomasKartya
   * @param {Event} event - Egy esemény objektum.
   * @function handleChange
   * @returns {void}
   */
  const handleChange = (event) => {
    setShow(true);
    const tmp = _.cloneDeep(megallok[irany].megallok);
    const { value } = event.target;
    tmp.find((val) => val.allomas === allomas.allomas).hanyPerc = value * 1;
    setMegallok((prevMegallok) => ({
      ...prevMegallok,
      [irany]: {
        ...prevMegallok[irany],
        megallok: tmp,
      },

      ...(checked && {
        [oppositeKey(irany)]: {
          ...prevMegallok[oppositeKey(irany)],
          megallok: megfordit(_.cloneDeep(tmp)).reverse(),
        },
      }),
    }));
  };

  /**
   * @description A jelenlegi állomást törli a listából.
   * @memberof AllomasKartya
   * @function torol
   * @returns {void}
   */
  const torol = () => {
    let index = megallok[irany].megallok.findIndex(
      (value) => JSON.stringify(value) === JSON.stringify(allomas)
    );
    if (index > 0 && index < megallok[irany].megallok.length - 1)
      megallok[irany].megallok[index + 1].elozoMegallo =
        megallok[irany].megallok[index - 1].allomas;
    const tmp = megallok[irany].megallok.filter(
      (value) => JSON.stringify(value) !== JSON.stringify(allomas)
    );
    setMegallok((prevMegallok) => ({
      ...prevMegallok,
      [irany]: {
        ...prevMegallok[irany],
        megallok: tmp,
      },
      ...(checked
        ? {
            [oppositeKey(irany)]: {
              ...prevMegallok[oppositeKey(irany)],
              megallok: megfordit(_.cloneDeep(tmp)).reverse(),
            },
          }
        : {}),
    }));
  };

  return (
    <Card className="d-flex flex-row text-start">
      <Card.Img
        className="flex-fill"
        variant="top"
        src={kep}
        alt=""
        style={{
          maxHeight: "100px",
          maxWidth: "100px",
          minHeight: "100px",
          minWidth: "100px",
        }}
      />
      <Card.Body className="flex-fill text-left ps-0">
        <Card.Title>
          {nev} (állomásID: {allomas.allomas})
        </Card.Title>
        <Card.Text>
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ width: "100%" }}
          >
            <div className="d-flex align-items-center">
              <span className="me-2">idő: </span>
              <InputMezo
                defaultValue={allomas.hanyPerc}
                input={{ columnName: "hanyPerc", dataType: "tinyint" }}
                handleChange={(event) => handleChange(event)}
              />
              <br />
            </div>
            {megallok[irany].megallok.length > 1 && (
              <Button variant="danger" onClick={() => torol(allomas)}>
                Állomás törlése
              </Button>
            )}
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default AllomasKartya;
