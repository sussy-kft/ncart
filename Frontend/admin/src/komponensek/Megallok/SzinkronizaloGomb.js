import React, { useContext } from "react";
import { ToggleButton } from "react-bootstrap";
import { MegallokContext } from "../../context/Megallok/MegallokContext";

/**
 * @module SzinkronizaloGomb
 * @description `SzinkronizaloGomb` egy React komponens, amely egy kapcsoló gombot jelenít meg a szinkronizáláshoz.
 * A felhasználó beállíthatja, hogy be vagy ki legyen kapcsolva a szinkronizálás.
 * Ha a szinkronizálás be van kapcsolva, akkor az oda és vissza irányú megállók tükörképei lesznek egymásnak.
 * (Az első megálló az egyik irányban az utolsó megálló a másik irányban stb.)
 *
 * @component
 *
 * @returns {React.Element} A toggle button that changes its appearance and functionality based on the state of the stops (`megallok`).
 */
function SzinkronizaloGomb() {
  const { megallok, checked, setChecked } = useContext(MegallokContext);

  /**
   * @memberof SzinkronizaloGomb
   * @description Megvizsgálja, hogy lehet-e szinkronizálni a megállókat.
   * Mivel a szinkronizálás akkor lehetséges, ha azonos számú megálló van mindkét irányban, és minden megálló ugyanaz a megálló a másik irányban, csak fordított sorrendben.
   * Ha a fetéltel teljesül, akkor a gomb kattintható, egyébként nem.
   * 
   * @returns {boolean} Ha a gomb képes a szinkronizálásra, akkor igaz, egyébként hamis.
   */
  const szinkronizalhato = () => {
    const { oda, vissza } = megallok;

    return (
      oda &&
      vissza &&
      oda.megallok.length === vissza.megallok.length &&
      oda.megallok.every(
        (value, index) =>
          value.allomas ===
            vissza.megallok[vissza.megallok.length - index - 1].elozoMegallo &&
          value.elozoMegallo ===
            vissza.megallok[vissza.megallok.length - index - 1].allomas
      )
    );
  };

  return (
    <ToggleButton
      id="toggle-check"
      className={`mt-3 ${megallok.vissza ? "" : "d-none"}`}
      type="checkbox"
      variant={checked ? "success" : "warning"}
      onMouseOver={(e) =>
        (e.target.className = checked
          ? "mt-3 btn btn-danger"
          : "mt-3 btn btn-success")
      }
      onMouseLeave={(e) =>
        (e.target.className = checked
          ? "mt-3 btn btn-success"
          : "mt-3 btn btn-warning")
      }
      checked={checked}
      onChange={(e) => {
        setChecked(e.currentTarget.checked);
      }}
      {...{ disabled: !szinkronizalhato() }}
    >
      Sinkronizálás {checked ? "kikapcsolása" : "bekopcsolása"}
    </ToggleButton>
  );
}

export default SzinkronizaloGomb;
