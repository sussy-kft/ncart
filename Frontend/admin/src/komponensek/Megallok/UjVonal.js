import React, { useEffect } from "react";
import { useContext } from "react";
import { AxiosContext } from "../../context/AxiosContext";
import Col from "react-bootstrap/Col";
import InputMezo from "../InputMezo";
import Button from "react-bootstrap/Button";

function UjVonal(props) {
  const { axiosId, errorState, getAll, getAllPromise, post } =
    useContext(AxiosContext);

  const [adatok, setAdatok] = React.useState({
    vonalSzam: props.masikVonal?.vonalSzam ?? props.meta.vonalSzam,
    jarmuTipus: props.masikVonal?.jarmuTipus ?? props.meta.id,
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
    // console.log("kuldes", adatok);
    // console.error(props.meta);
    const asd = await post("vonalak", adatok);
    console.log("asd", asd);
    // rip sussy code
    props.setMegallok(asd);
    props.setRegiMegallok(asd);
  };

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
        idk={true}
        handleChange={handleChange.bind(this, "kezdoAll")}
      />
      <InputMezo
        as={Col}
        name="id"
        value="nev"
        pool={opciok}
        isSelect={true}
        idk={true}
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
