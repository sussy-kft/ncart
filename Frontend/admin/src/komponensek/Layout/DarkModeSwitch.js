import React, { useContext } from "react";
import { FormCheck } from "react-bootstrap";
import { DarkModeContext, Tema } from "../../context/Alap/DarkModeContext";
import * as Icon from "react-bootstrap-icons";

/**
 * DarkModeSwitch egy olyan komponens, ami világos és sötét mód között vált.
 * A DarkModeContext-ot használja a jelenlegi téma beállításához és lekéréséhez.
 *
 * @component
 * 
 * @returns {JSX.Element} Egy switch, amely világos és sötét mód között vált.
 */
function DarkModeSwitch() {

  const { setDarkMode, getText } = useContext(DarkModeContext);

  /**
   * @type {React.Component} IconComponent
   * Egy ikon, ami a kovetkező témát reprezentálja. Ez MoonFill a világos téma esetén és SunFill a sötét téma esetén.
   */
  const IconComponent = getText() === Tema.LIGHT ? Icon.MoonFill : Icon.SunFill;

  return (
    <div className="order-lg-1 d-flex align-items-center">
      <FormCheck
        style={{ marginRight: "10px", marginLeft: "auto" }}
        type="switch"
        onClick={() => {
          setDarkMode(getText() === Tema.LIGHT ? Tema.DARK : Tema.LIGHT);
        }}
      />
      <IconComponent
        color={getText() === Tema.LIGHT ? "dark" : "white"}
        size={20}
        className="ml-4 order-lg-1"
        style={{ marginRight: "20px", marginLeft: "auto" }}
      />
    </div>
  );
}

export default DarkModeSwitch;
