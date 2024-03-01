import React, { useContext } from "react";
import Table from "react-bootstrap/Table";
import Button from 'react-bootstrap/Button';
import PopUpPanel from "./PopUpPanel";
import { useState } from 'react';
import { AxiosContext } from "../context/AxiosContext";
import { MetaadatContext } from "../context/MetaadatContext";

function Lekerdezes(props) {

  const {axiosId, getAll} = useContext(AxiosContext);
  const {url, getPKs} = useContext(MetaadatContext);

  const [show, setShow] = useState(false);
  const [id, setId] = useState(-1);
  const [adatok, setAdatok] = React.useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const xd= (row) => { 
    const tmp = [];
    getPKs().map((key, ix) => {
      tmp[ix] = row[key.charAt(0).toLowerCase() + key.slice(1)];
    })
    setId(tmp.join("/"));
    console.log(tmp);
    handleShow()
    console.log(row);
  }
  
  React.useEffect(() => {
    setAdatok(getAll(url, setAdatok));
  }, [url, axiosId]);

  if (!adatok) return <h1>Betöltés...</h1>;

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            {fejlecElem(adatok[0]??[])}
            {adatok[0] && <th>Módosítás</th>}
            {adatok[0] && <th>Törlés</th>}
          </tr>
        </thead>
        <tbody>
          {adatok.map((row, ix) => (
            <tr key={ix}>
              {cellaElem(row)}
              <td><Button key="primary" variant="primary">Módosítás</Button></td>
              <td><Button key="danger" variant="danger" onClick={() =>{xd(row)}}>Törlés</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <PopUpPanel show={show} handleClose={handleClose} handleShow={handleShow} id={id}/>
    </>
  );
}

function fejlecElem(elem) {
  const tmp = [];
  tmp.push(Object.keys(elem).map( key => {
    if (typeof elem[key] !== "object") 
      return <th key={key}>{key}</th>
    else 
      return fejlecElem(elem[key]);
  }))
  return tmp;
}

function cellaElem(elem) {
  const tmp = [];
  tmp.push(Object.keys(elem).map( key => {
    if (typeof elem[key] !== "object") 
      return <td key={key}>{elem[key]}</td>
    else 
      return cellaElem(elem[key])
  }))
  return tmp;
}
export default Lekerdezes;
