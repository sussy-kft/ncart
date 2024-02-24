import React, { useContext } from "react";
import Table from "react-bootstrap/Table";
import Button from 'react-bootstrap/Button';
import PopUpPanel from "./PopUpPanel";
import { useState } from 'react';
import { AxiosContext } from "../context/AxiosContext";

function Lekerdezes(props) {

  const {axiosId, get} = useContext(AxiosContext);
  console.log(axiosId);

  const [show, setShow] = useState(false);
  const [id, setId] = useState(-1);
  const [post, setPost] = React.useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const xd= (ix) => { setId(ix); handleShow();console.log(ix);}
  
  React.useEffect(() => {
    setPost(get(props.url, null, setPost, props.addInfoPanel));
    console.log("Lekerdezes");
  }, [props.url, axiosId]);

  if (!post) return null;

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            {fejlecElem(post[0]??[])}
            <th>Módosítás</th>
            <th>Törlés</th>
          </tr>
        </thead>
        <tbody>
          {post.map((row, ix) => (
            <tr key={ix}>
              {cellaElem(row)}
              <td><Button key="primary" variant="primary">Módosítás</Button></td>
              <td><Button key="danger" variant="danger" onClick={() =>{xd(row.id)}}>Törlés</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <PopUpPanel show={show} handleClose={handleClose} handleShow={handleShow} url={props.url} id={id}/>
    </>
  );
}

function fejlecElem(elem) {
  const tmp = [];
  {Object.keys(elem).map( key => {
    if (typeof elem[key] !== "object") 
      tmp.push(<th key={key}>{key}</th>)
    else 
      tmp.push(fejlecElem(elem[key]));
  })}
  return tmp;
}

function cellaElem(elem) {
  const tmp = [];
  Object.keys(elem).map( key => {
    if (typeof elem[key] !== "object") 
      tmp.push(<td key={key}>{elem[key]}</td>);
    else 
      tmp.push(cellaElem(elem[key]));
  });
  return tmp;
}
export default Lekerdezes;
