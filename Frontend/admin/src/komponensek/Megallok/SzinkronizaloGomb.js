import React from "react";
import { ToggleButton } from "react-bootstrap";

/**
 * 
 * @component
 * @param {string} megjelenes - Egyszerű string, ami a gomb megjelenését befolyásolja. Ezt a stringet az osztály nevéhez fűzzük, ami a Bootstrap segítségével befolyásoljuk a megjelenést.
 * @param {boolean} checked - A gomb állapotát jelzi. Ha igaz, akkor a gomb zöld, különben sárga.
 * @param {Function} setChecked - Egy callback függvény, ami beállítja a szinkronizálás állapotát.
 * @param {Function} szinkronizalhato - Egy függvény, ami meghatározza, hogy a gomb lenyomható-e. Ha nem, akkor a gomb inaktív lesz.
 *  
 * @returns {React.Element} SzinkronizaloGomb komponenst.
 */
function SzinkronizaloGomb({megjelenes, checked, setChecked, szinkronizalhato}){
    return(
        <ToggleButton
            id="toggle-check"
            className={`mt-2 ${megjelenes}`}
            type="checkbox"
            variant={checked ? "success" : "warning"}
            onMouseOver={(e) =>
              (e.target.className = checked
                ? "mt-2 btn btn-danger"
                : "mt-2 btn btn-success")
            }
            onMouseLeave={(e) =>
              (e.target.className = checked
                ? "mt-2 btn btn-warning"
                : "mt-2 btn btn-warning")
            }
            checked={checked}
            onChange={(e) => {
              setChecked(e.currentTarget.checked);
            }}
            {...{ disabled: !szinkronizalhato() }}
          >
            Sinkronizálás {checked ? "kikapcsolása" : "bekopcsolása"}
          </ToggleButton>
    )
}

export default SzinkronizaloGomb;