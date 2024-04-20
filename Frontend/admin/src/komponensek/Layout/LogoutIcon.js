import React from "react";
import * as Icon from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

/**
 * Egy LogoutIcon komponens, ami egy kijelentkezés ikont megjeleníti.
 * Amikor az ikonra kattintanak, eltávolítja a "felhasznalo" értéket a sessionStorage-ből,
 * és a "token" értéket a localStorage-ből, majd átnavigál a "/login" útvonalra.
 *
 * @component
 * 
 * @returns {JSX.Element} A "Kijelentkezés" ikont tartalmazó elem.
 *
 */
function LogoutIcon() {
  const navigate = useNavigate();

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
