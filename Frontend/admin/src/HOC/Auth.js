import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MetaadatContext } from "../context/Alap/MetaadatContext";

/**
 * Az Auth egy higher-order component (HOC), ami ellenőrzi, hogy a felhasználó hitelesítve van.
 * Ha a felhasználó hitelesítve van, akkor megjeleníti a megadott komponenst.
 * Ha a felhasználó nincs hitelesítve, vagy a token lejár, akkor átirányítja a felhasználót a bejelentkezési oldalra. (/login)
 *
 * @module Auth
 * @param {React.Component} Component - Egy komponens, ami hitelesítésre vár mielőtt megjelenítjük.
 * @returns {React.Component|null} - Ha sikerült a hitelesítés, akkor visszaadja a komponenst, vagy `null`, ha a hitelesítés nem sikerült.
 */
function Auth(Component) {
  return function AuthComponent(props) {
    const { getMaradekIdo } = React.useContext(MetaadatContext);

    const [hitelesitve, setHitelesitve] = useState(false);
    const navigate = useNavigate();

    /**
     * Egy függvény, ami kijelentkezteti a felhasználót.
     * Törli a tokent, a felhasználó e-mail címét és a token lejárati idejét a localStorage-ból.
     * Átirányítja a felhasználót a bejelentkezési oldalra.
     * Beállítja a `hitelesítve` állapotot hamisra.
     *
      * @name kijelentkezes
      * @kind function
      * @memberof Auth
     */
    const kijelentkezes = () => {
      setHitelesitve(false);
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("felhasznalo");
      window.localStorage.removeItem("lejaratiIdopont");
      navigate("/login");
    };

    /**
     * useEffect hook ellenőrzi, hogy a felhasználó rendelkezik érvényes tokennel.
     * Ha rendelkezik valamilyen tokennel, akkor beállítja a `hitelesítve` állapotot igazra.
     * Ha nem rendelkezik érvényes tokennel, vagy ha eltelik egy óra,
     * akkor eltávolítja a tokent, a felhasználó e-mail címát és a token lejárati idejét a localStorage-ból,
     * átirányítja a felhasználót a bejelentkezési oldalra, és beállítja a `hitelesítve` állapotot hamisra.
     * 
     * @memberof Auth
     */
    useEffect(() => {
      if (localStorage.getItem("token")) {
        setHitelesitve(true);
        setTimeout(kijelentkezes, getMaradekIdo());
      } else kijelentkezes();
    }, [navigate]);

    return hitelesitve ? <Component {...props} /> : null;
  };
}

export default Auth;
