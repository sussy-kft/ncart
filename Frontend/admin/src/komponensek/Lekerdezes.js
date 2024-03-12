import React, { useContext } from "react";
import Table from "react-bootstrap/Table";
import PopUpPanel from "./PopUpPanel";
import { useState } from 'react';
import { AxiosContext } from "../context/AxiosContext";
import { MetaadatContext } from "../context/MetaadatContext";
import Sor from "./Sor";

function Lekerdezes(props) {

  const { axiosId, errorState, getAll } = useContext(AxiosContext);
  const { url, getPKs } = useContext(MetaadatContext);

  const [show, setShow] = useState(false);
  const [id, setId] = useState(-1);
  const [adatok, setAdatok] = React.useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const xd = (row) => {
    const id = getPKs().map(value => row[value[0].toLowerCase() + value.slice(1)]).join("/");
    setId(id);
    handleShow();
    console.log(row);
  }

  React.useEffect(() => {
    setAdatok(getAll(url, setAdatok));
  }, [url, axiosId]);

  if (!adatok || !getPKs()) return errorState ? <img src="https://http.cat/503" /> : <img src="https://http.cat/102" />; 

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            {fejlecElem(adatok[0] ?? [])}
            {adatok[0] && getPKs().length !== Object.keys(adatok[0]).length && <th>Módosítás</th>}
            {adatok[0] && <th>Törlés</th>}
          </tr>
        </thead>
        <tbody>
          {adatok.map((row, ix) => (
            <Sor key={ix} row={row} callback={xd} />
          ))}
        </tbody>
      </Table>
      <PopUpPanel show={show} handleClose={handleClose} handleShow={handleShow} id={id} />
    </>
  );
}

function fejlecElem(elem) {
  return Object.keys(elem).map(key => 
    typeof elem[key] !== "object" 
    ? <th key={key}>{key}</th> 
    : fejlecElem(elem[key])
  )
}

export default Lekerdezes;
