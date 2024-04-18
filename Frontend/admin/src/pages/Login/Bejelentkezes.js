import React from "react";
import { Form } from "react-bootstrap";
import InputMezo from "../../komponensek/InputMezo";
import Button from "react-bootstrap/Button";
import { AxiosContext } from "../../context/AxiosContext";
import "./Bejelentkezes.css";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/DarkModeContext";
import { InfoPanelContext } from "../../context/InfoPanelContext";

/**
 * A Bejelentkezes komponens felelős a bejelentkezési űrlap megjelenítéséért és a bejelentkezési folyamat kezeléséért.
 * @returns {JSX.Element} A megjeleníteni kivánt `Bejelentkezes` komponenst.
 */
function Bejelentkezes() {
  const { getText } = React.useContext(DarkModeContext);
  const { post } = React.useContext(AxiosContext);
  const { resetInfoPanel } = React.useContext(InfoPanelContext);

  const navigate = useNavigate();
  const inputs = [
    { columnName: "email", dataType: "email" },
    { columnName: "password", dataType: "password", characterMinimumLength: 8 },
  ];

  const [validated, setValidated] = React.useState(false);
  const [adatok, setAdatok] = React.useState({});
  
  /**
   * Egy függvény, ami generál form input mezőket az inputs listából.
   * @returns {Form.Group[]} Egy tömböt, ami a generált form input mezőket tartalmazza.
   */
  const inputGenerator = () => {
    return (
      inputs?.map((input) => {
        return (
          <Form.Group className="mb-3" key={input.columnName}>
            <Form.Label>{input.columnName + ": "}</Form.Label>
            <InputMezo input={input} handleChange={handleChange} />
            <Form.Control.Feedback type="invalid" />
          </Form.Group>
        );
      }) || []
    );
  };

  /**
   * Egy függvény, ami a form adatait elküldi a backendnek, ami visszaküldi a token-t, amit a localStorage-ba menti.
   * Továbbá a felhasználó email címét a sessionStorage-be menti, átirányítja az admin oldalra és törli az összes info panelt.
   * @param {Event} event - A form küldési eseménye.
   */
  const handleSumbit = (event) => {
    event.preventDefault();
    setValidated(true);
    post("kezelok/login", adatok, (valasz) => {
      resetInfoPanel()
      window.sessionStorage.setItem("felhasznalo", adatok.email);
      localStorage.setItem("token", valasz.token);
      navigate("/admin");
    });
  };

  /**
   * Egy függvény, ami a form input mezőinek változását kezeli.
   * @param {Event} event - A megváltozott input mező eseménye.
   */
  const handleChange = (event) => {
    setAdatok((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Form
        noValidate
        validated={validated}
        id="bejelentkezes"
        style={{
          backgroundColor: getText() === "dark" ? "#1f2938" : "#f3f4f6",
          color: getText() === "dark" ? "white" : "black",
        }}
        onSubmit={(event) => handleSumbit(event)}
      >
        {inputGenerator()}
        <div className="d-flex justify-content-end mt-5">
          <Button
            type="submit"
            variant={getText() === "dark" ? "light" : "dark"}
          >
            Bejelentkezés
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Bejelentkezes;