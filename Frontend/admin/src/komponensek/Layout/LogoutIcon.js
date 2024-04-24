import React from "react";
import * as Icon from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

/**
 * @module LogoutIcon
 * @description Egy LogoutIcon komponens, ami egy kijelentkezés ikont megjeleníti.
 * Amikor az ikonra kattintanak, eltávolítja a "felhasznalo", a "token" és a "lejaratiIdopont"
 * értéket a localStorage-ből, majd átnavigál a "/login" útvonalra.
 *
 * @component
 * 
 * @returns {JSX.Element} Egy Bootstrap DoorOpenFill ikont.
 *
 */
function LogoutIcon() {
  const navigate = useNavigate();

  /**
   * @memberof LogoutIcon
   * @type {Function}
   * @function handleLogout
   * @description Az handleLogout egy függvény, ami a kijelentkezés folyamatát végzi el.
   * Eltávolítja a "felhasznalo", "token" és a "lejaratiIdopont" értékét a localStorage-ből, majd átnavigál a "/login" útvonalra.
   * @returns {void}
   */
  const handleLogout = () => {
    window.localStorage.removeItem("lejaratiIdopont");
    window.localStorage.removeItem("felhasznalo");
    window.localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Icon.DoorOpenFill
      color="#ff4040"
      title="Kijelentkezés"
      size={20}
      onClick={handleLogout}
      style={{ marginRight: "10px", marginLeft: "4px", cursor: "pointer" }}
    />
  );
}

export default LogoutIcon;
