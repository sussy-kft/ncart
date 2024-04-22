import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import { AxiosContext } from "../../context/Alap/AxiosContext";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { MetaadatContext } from "../../context/Alap/MetaadatContext";
import InputMezo from "../kozos/InputMezo";
import { Container } from "react-bootstrap";


/**
 * @module FormMezo
 * @component
 * @description `FormMezo` egy komponens, ami egy űrlapot generál a `metaadat` és `url` alapján.
 * A form mezők dinamikusan generálódnak a `metaadat` kontextus alapján, emiatt, ha egy másik form mezőt akarunk, elég, ha csak a `metaadat`-ot cseréljük le.
 * A form a `MetaadatContext` `url` segítségével küldjük el a szervernek POST kérésben az adatokat.
 *
 * @returns {JSX.Element} Egy {@link Form} ({@link Container}-be beágyazva) komponenst ad vissza. 
 */
function FormMezo() {
  const { post } = useContext(AxiosContext);
  const { metaadat, url } = useContext(MetaadatContext);

  /**
   * @memberof FormMezo
   * @description Egy useState hook, ami a form mezők validálását jelző állapot.
   * 
   */
  const [validated, setValidated] = useState(false);
  const [adatok, setAdatok] = useState({});

  /**
   * @typedef {Object} Target
   * @memberof FormMezo
   * @property {string} name - Az objektum kulcsa az `adatok` objektumban.
   * @property {string} type - Az input mező típusa.
   * @property {boolean} checked - Jelzi, hogy a checkbox be van-e jelölve.
   * @property {string} value - Az új érték, amit be kell állítani.
   */

  /**
   * @description A változásokért felelős függvény
   * @memberof FormMezo
   * @function handleChange
   * @param {Object} event - Egy esemény objektum.
   * @param {Target} event.target - Az esemény célja.
   */
  const handleChange = ({ target }) =>{
    const { name, type, checked, value } = target;
    setAdatok((values) => ({
      ...values,
      [name]:
        type === "checkbox"
          ? checked
            ? [...(values[name] ?? []), value]
            : (values[name] ?? []).filter((elem) => elem !== value)
          : value,
    }));
  }

  /**
   * @memberof FormMezo
   * @description A form mezők generálása a `metaadat` alapján.
   * @function generateInput
   *
   * @param {Array} lista - Egy lista, ami a generálandó mezőket tartalmazza.
   * @returns {Array} A legenerált form mezők, amiket már meg lehet jeleníteni.
   */
  const generateInput = (lista) =>
    lista?.flatMap((input) =>
      Array.isArray(input.dataType) ? 
        generateInput(input.dataType)
        : (
        <Form.Group key={input.columnName} as={Col} md="4">
          <Form.Label>{`${input.columnName}: `}</Form.Label>
          <InputMezo input={input} handleChange={handleChange} />
          <Form.Control.Feedback type="invalid" />
        </Form.Group>
      )
    ) || [];

  /**
   * @memberof FormMezo
   * @description A form elküldésekor lefutó függvény.
   * @function kuldes
   * @param {Event} event - Esemény objektum.
   */
  const kuldes = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity()) {
      event.stopPropagation();
      post(url, adatokGenerator(metaadat));
    }
    setValidated(true);
  };

  /**
   * @memberof FormMezo
   * @description A form mezőkből egy válasz objektumot generál, amit a POST kérésben lehet használni.
   * @function adatokGenerator
   * @param {Array} mintaAdatLista - Egy minta objektum lista, amiből tudja, hogy hogyan kell kiolvasni az adatokat.
   * @returns {object} A generált válasz objektum.
   */
  const adatokGenerator = (mintaAdatLista) =>
    mintaAdatLista.reduce(
      (tmp, kulcs) => ({
        ...tmp,
        [kulcs.columnName]: Array.isArray(kulcs.dataType)
          ? adatokGenerator(kulcs.dataType)
          : adatok[kulcs.columnName],
      }),
      {}
    );

  if (!metaadat) return <h1>Betöltés...</h1>;

  return (
    <Container>
      <Form noValidate validated={validated} onSubmit={kuldes}>
        <h2 className="mt-3">Új adat hozzáadása:</h2>
        <Row className="mb-2 mt-3">{generateInput(metaadat)}</Row>
        <Button className="mb-4" type="submit">
          Küldés
        </Button>
      </Form>
    </Container>
  );
}

export default FormMezo;
