import React, { useContext, useState } from "react";
import { Form } from "react-bootstrap";
import InputMezo from "../../../komponensek/kozos/InputMezo";
import Button from "react-bootstrap/Button";
import {AxiosContext} from "../../../context/Alap/AxiosContext";
import "./Bejelentkezes.css";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../../context/Alap/DarkModeContext";
import { InfoPanelContext } from "../../../context/Alap/InfoPanelContext";
import videoBackground from "../../../media/map.mp4";


/**
 * @module Bejelentkezes
 * @description A Bejelentkezes komponens felelős a bejelentkezési űrlap megjelenítéséért és a bejelentkezési folyamat kezeléséért.
 * @returns {JSX.Element} A megjeleníteni kivánt `Bejelentkezes` komponenst.
 */
function Bejelentkezes() {
  const { getText } = useContext(DarkModeContext);
  const { post } = useContext(AxiosContext);
  const { resetInfoPanel } = useContext(InfoPanelContext);

  const navigate = useNavigate();
  const inputs = [
    { columnName: "email", dataType: "email" },
    { columnName: "password", dataType: "password" },
  ];

  const [adatok, setAdatok] = useState({});
  const [shake, setShake] = useState("");
  
  /**
   * @function
   * @memberof Bejelentkezes
   * @description Egy függvény, ami generál form input mezőket az inputs listából.
   * @returns {Form.Group[]} Egy tömböt, ami a generált form input mezőket tartalmazza.
   */
  const inputGenerator = () => {
    return (
      inputs?.map((input) => {
        return (
          <Form.Group className="mb-3" key={input.columnName}>
            <Form.Label>{input.columnName + ": "}</Form.Label>
            <InputMezo input={input} handleChange={handleChange} />
          </Form.Group>
        );
      }) || []
    );
  };

  /**
   * @function
   * @memberof Bejelentkezes
   * @description Egy függvény, ami a form adatait elküldi a backendnek, ami visszaküldi a tokent és a lejárati időpontot, amit a localStorage-ba menti.
   * Továbbá a felhasználó email címét is a `localStorage`-ba menti, átirányítja az admin oldalra és törli az összes info panelt.
   * Ha esetleg valami miat nem sikerül a bejelentkezés, akkor a formot megrázza, hogy jelezze a hibát.
   * @param {Event} event - A form küldési eseménye.
   */
  const handleSumbit = (event) => {
    event.preventDefault();
    post("kezelok/login", adatok, (valasz) => {
      resetInfoPanel()
      localStorage.setItem("felhasznalo", adatok.email);
      localStorage.setItem("token", valasz.token);
      localStorage.setItem("lejaratiIdopont", valasz.lejaratiIdopont);
      navigate("/admin");
    },
    () => {
      setShake("shake")
      setTimeout(() => {
        setShake("")
      }, 500);
    });
  };

  /**
   * @function
   * @memberof Bejelentkezes
   * @description Egy függvény, ami a form input mezőinek változását kezeli.
   * @param {Event} event - A megváltozott input mező eseménye.
   */
  const handleChange = (event) => {
    setAdatok((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

    return (
        <div className="video-background">
            <video autoPlay loop muted className="fullscreen-bg__video">
                <source src={videoBackground} type="video/mp4" />
            </video>
            <div
                className="d-flex justify-content-center align-items-center"
                style={{height: "100vh", position: "relative"}}
            >
                <Form
                    className={shake}
                    id="bejelentkezes"
                    style={{
                        backgroundColor: "transparent", // Átlátszó háttér
                        color: getText() === "dark" ? "white" : "black",
                        position: "relative", // Hogy a form a videó felett legyen
                        zIndex: 1, // Hogy a form a videó felett legyen
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
        </div>
    );
}

export default Bejelentkezes;
