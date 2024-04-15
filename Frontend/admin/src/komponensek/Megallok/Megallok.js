import React, { useContext } from "react";
import VonalSzuro from "./VonalSzuro";
import { AxiosContext } from "../../context/AxiosContext";
import { MetaadatContext } from "../../context/MetaadatContext";
import { Form, Row } from "react-bootstrap";
import MegalloOldal from "./MegalloOldal";

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
            <VonalSzuro

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
      {megallok && <MegalloOldal megallok={megallok} meta={meta}/>}
    </>
  );
}

export default Megallok;
