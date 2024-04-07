import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Az Auth egy higher-order component (HOC), ami ellenőrzi, hogy a felhasználó hitelesítve van.
 * Ha a felhasználó hitelesítve van, akkor megjeleníti a megadott komponenst.
 * Ha a felhasználó nincs hitelesítve, akkor átirányítja a felhasználót a bejelentkezési oldalra. (/login)
 *
 * @param {React.Component} Component - Egy komponens, ami hitelesítésre vár mielőt megjelenítjük.
 * @returns {React.Component|null} - Ha sikerült a hitelesítés, akkor visszaadja a komponenst, vagy `null`, ha a hitelesítés nem sikerült.
 */
function Auth(Component) {
  return function AuthComponent(props) {
    const [hitelesitve, setHitelesitve] = useState(false);
    const navigate = useNavigate();

    const kijelentkezes = () => {
      setHitelesitve(false);
      window.localStorage.removeItem("token");
      window.sessionStorage.removeItem("felhasznalo");
      navigate("/login");
    };

    /**
     * useEffect hook to ellenőrzi, hogy a felhasználó rendelkezik érvényes tokennel.
     * Ha rendelkezik valamilyen tokennel, akkor beállítja a hitelesítve állapotot igazra.
     * Ha nem rendelkezik érvényes tokennel, vagy ha eltelik egy óra, akkor eltávolítja a tokent a localStorage-ból, átirányítja a felhasználót a bejelentkezési oldalra, és beállítja a hitelesítve állapotot hamisra.
     */
    useEffect(() => {
      if (localStorage.getItem("token")) {
        setHitelesitve(true);
        setTimeout(kijelentkezes, 3600000);
      } 
        else kijelentkezes();
    }, [navigate]);

    return hitelesitve ? <Component {...props} /> : null;
  };
}

export default Auth;
