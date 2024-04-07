import React, { useContext } from "react";
import InputSelects from "./InputSelects";
import { AxiosContext } from "../../context/AxiosContext";
import { MetaadatContext } from "../../context/MetaadatContext";
import { Form, Row } from "react-bootstrap";
import MegalloSzerkeszto from "./MegalloSzerkeszto";

function Megallok(props) {
  const { axiosId, errorState, getAll } = useContext(AxiosContext);
  const { url, getPKs, findKey, metaadat, kulsoAdatok } = useContext(MetaadatContext);

  const [megallok, setMegallok] = React.useState(null);
  const [meta, setMeta] = React.useState(null);

  return (
    <>
      <h1>{props.cim}</h1>
      <Form className="container">
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
                setMeta={setMeta}
            />
        </Row>
      </Form>
      {megallok && <MegalloSzerkeszto megallok={megallok} meta={meta}/>}
    </>
  );
}

export default Megallok;
