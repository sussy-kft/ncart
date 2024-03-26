import React, { useEffect } from "react";
import { useContext } from "react";
import { AxiosContext } from "../../context/AxiosContext";
import Col from "react-bootstrap/Col";
import InputMezo from "../InputMezo";
import Button from "react-bootstrap/Button";

function UjVonal(props) {
  const { axiosId, errorState, getAll, getAllPromise, post } = useContext(AxiosContext);

  const [adatok, setAdatok] = React.useState({
    vonalSzam: props.masikVonal.vonalSzam,
    jarmuTipus: props.masikVonal.jarmuTipus,
  });
  const [opciok, setOpciok] = React.useState(null);

  console.log(adatok);
  useEffect(() => {
    getAll("allomasok", setOpciok);
  }, []);

  const handleChange = (customName, event) => {
    console.log(event);
    const { value } = event.target;
    setAdatok((values) => ({ ...values, [customName]: value }));
  };

  /**
   * 
   */
  const kuldes = async () => {
    await post("vonalak", adatok);
    props.setMegallok(null)
    let response=null
    while(!response || !response?.vissza){ 
        response = await getAllPromise("megallok/vonalmegallok/" + adatok.vonalSzam + "/" + adatok.jarmuTipus);  
    }
    console.log("asd",response.vissza);
    props.setMegallok(response);
    props.setRegiMegallok(response);
}

    /**
     * 
     */

  if (!opciok) return null;

  return (
    <div>
      <h3>Nincs még {`${props.name} vezető útvonal`}</h3>
      <br />
      <h4>Új {props.name} útvonal hozzáadása</h4>
      <InputMezo
        as={Col}
        name="id"
        value="nev"
        pool={opciok}
        isSelect={true}
        handleChange={handleChange.bind(this, "kezdoAll")}
      />
      <InputMezo
        as={Col}
        name="id"
        value="nev"
        pool={opciok}
        isSelect={true}
        handleChange={handleChange.bind(this, "vegall")}
      />
      <Button
        as={Col}
        variant="success"
        onClick={(event) => kuldes(event, adatok)}
      >
        Új {props.name} útvonal
      </Button>
    </div>
  );
}

export default UjVonal;
