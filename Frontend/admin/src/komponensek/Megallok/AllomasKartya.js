import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import InputMezo from "../InputMezo";
import kep from "../../media/xd.png";

/**
 * Egy React komponens, ami egy kártyát jelenít meg egy állomás adataival.
 *
 * @param {Object} allomas - Az állomás objektum, ami tartalmazza az állomás adatait.
 * @param {string} allomas.allomas - Az állomás ID-ja.
 * @param {number} allomas.hanyPerc - Hogy hány percig tart eljutni a következő állomásra.
 * @param {string} nev - Az állomás neve.
 * @param {Function} torol - Egy függvény, ami meghívódik, amikor a törlés gombra kattintanak.
 * @param {Function} handleChange - The function to be called when the input field value changes.
 *
 * @returns {React.Element} A megjelenítendő állomás kártyát vagy `null`-t, ha az állomás objektum nem létezik.
 */
function AllomasKartya({allomas, nev, torol, handleChange }) {

  if (!allomas) return null;

  console.log("sussy", allomas);
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
                veryCoolValue={allomas.hanyPerc}
                input={{ columnName: "hanyPerc", dataType: "tinyint" }}
                handleChange={(event) => handleChange(allomas, event)}
              />
              <br />
            </div>
            {torol && (
              <Button variant="danger" onClick={() => torol(allomas)}>
                Állomás törlése
              </Button>
            )}
          </div>

          {/* <br/> */}
        </Card.Text>
        {/* {props.allomas.hanyPerc}</Card.Text> */}
      </Card.Body>
    </Card>
  );
}

export default AllomasKartya;
