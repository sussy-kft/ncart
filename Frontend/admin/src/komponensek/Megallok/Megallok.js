import React, { useContext } from "react";
import InputSelects from "./InputSelects";
import { AxiosContext } from "../../context/AxiosContext";
import { MetaadatContext } from "../../context/MetaadatContext";
import { Form, Row } from "react-bootstrap";
import MegalloSzerkeszto from "./MegalloSzerkeszto";

function Megallok() {
  const { axiosId, errorState, getAll } = useContext(AxiosContext);
  const { url, getPKs, findKey, metaadat, kulsoAdatok } = useContext(MetaadatContext);

  const [megallok, setMegallok] = React.useState(null);
  return (
    <>
      <h1>Megállok</h1>
      <Form>
        <Row>
            <InputSelects

                pool={[
                {
                    url: "vonalak",
                    key: "vonalSzam",
                    value: "vonalSzam",
                    label: "Vonalszám"
                },
                {
                    url: "jarmutipusok",
                    key: "id",
                    value: "megnevezes",
                    label: "Járműtípus"
                },
                ]}
                handleChange={setMegallok}
            />
        </Row>
      </Form>
      {megallok && <MegalloSzerkeszto megallok={megallok} />}
    </>
  );
}

export default Megallok;
