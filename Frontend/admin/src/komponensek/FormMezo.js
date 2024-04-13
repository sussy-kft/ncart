import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import { AxiosContext } from "../context/AxiosContext";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { MetaadatContext } from "../context/MetaadatContext";
import InputMezo from "./InputMezo";
import { Container } from "react-bootstrap";

/**
 * `FormMezo` egy komponens, ami egy űrlapot generál a `metaadat` és `url` alapján.
 * A form mezők dinamikusan generálódnak a `metaadat` kontextus alapján, emiatt ha egy másik form mezőt akarunk, elég ha csak a `metaadat`-ot cseréljük le.
 * A form adatok a `MetaadatContext` `url`-jére kerülnek POST kérésben elküldésre.
 *
 * @returns {JSX.Element} Egy {@link Form} ({@link Container}-be beágyazva) komponenst ad vissza. 
 */
function FormMezo() {
  const { post } = useContext(AxiosContext);
  const { metaadat, url } = useContext(MetaadatContext);

  /**
   * A form mezők változásait kezelő függvény.
   *
   * @param {object} event - Esemény objektum.
   */
  const [validated, setValidated] = useState(false);
  const [adatok, setAdatok] = useState({});

  const handleChange = ({ target: { name, type, checked, value } }) =>
    setAdatok((values) => ({
      ...values,
      [name]:
        type === "checkbox"
          ? checked
            ? [...(values[name] ?? []), value]
            : (values[name] ?? []).filter((elem) => elem !== value)
          : value,
    }));

  /**
   * A form mezők generálása a `metaadat` kontextus alapján.
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
   * A form elküldésekor lefutó függvény.
   *
   * @param {object} event - Esemény objektum.
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
   * A form mezőkből egy objektumot generál, amit a POST kérésben lehet használni.
   *
   * @param {Array} mintaAdat - Egy minta objektum lista, amiből tudja, hogy hogyan kell kiolvasni az adatokat.
   * @returns {object} A generált válasz objektum.
   */
  const adatokGenerator = (mintaAdat) =>
    mintaAdat.reduce(
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
