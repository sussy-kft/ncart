import React, { useContext } from "react";
import { FormCheck } from "react-bootstrap";
import { DarkModeContext, TEMA } from "../../context/Alap/DarkModeContext";
import * as Icon from "react-bootstrap-icons";


/**
 * @description DarkModeSwitch egy olyan komponens, ami világos és sötét mód között vált.
 * A DarkModeContext-ot használja a jelenlegi téma beállításához és lekéréséhez.
 * @module DarkModeSwitch
 * @component
 * 
 * @returns {JSX.Element} Egy switch, amely világos és sötét mód között vált.
 */
function DarkModeSwitch() {

  const { setDarkMode, getText } = useContext(DarkModeContext);

  /**
   * @memberof DarkModeSwitch
   * @type {React.Component} IconComponent
   * @description Egy komponens ikon, ami a kovetkező témát reprezentálja. Ez MoonFill a világos téma esetén és SunFill a sötét téma esetén.
   */
  const IconComponent = getText() === TEMA.LIGHT ? Icon.MoonFill : Icon.SunFill;

  return (
    <div className="order-lg-1 d-flex align-items-center">
      <FormCheck
        style={{ marginRight: "10px", marginLeft: "auto" }}
        type="switch"
        onClick={() => {
          setDarkMode(getText() === TEMA.LIGHT ? TEMA.DARK : TEMA.LIGHT);
        }}
      />
      <IconComponent
        color={getText() === TEMA.LIGHT ? "dark" : "white"}
        size={20}
        className="ml-4 order-lg-1"
        style={{ marginRight: "20px", marginLeft: "auto" }}
      />
    </div>
  );
}

export default DarkModeSwitch;
