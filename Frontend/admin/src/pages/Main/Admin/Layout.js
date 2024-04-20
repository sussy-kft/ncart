import { useEffect, useState, useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import LogoutIcon from "../../../komponensek/Layout/LogoutIcon";
import DarkModeSwitch from "../../../komponensek/Layout/DarkModeSwitch";
import { MetaadatContext } from "../../../context/Alap/MetaadatContext";

function Layout() {
  const { getMaradekIdo } = useContext(MetaadatContext);

  /**
   * A `maradekIdo` tárolja, hogy a felhasználónak mennyi ideje van hátra a kijelentkezésig.
   * Egy `useEffect` hookot használ, hogy létrehozzon egy időzítőt, ami minden másodpercben frissíti a `maradekIdo` állapotváltozót.
   * Az időzítő a {@link MetaadatContext#getMaradekIdo} függvényt használja, hogy lekérje a hátralévő időt.
   */
  const [maradekIdo, setMaradekIdo] = useState(getMaradekIdo());

  useEffect(() => {
    const idozito = setInterval(() => setMaradekIdo(getMaradekIdo()), 1000);
    return () => clearInterval(idozito);
  }, []); 

  /**
   * A `ketSzamjegy` függvény egy számot vár bemenetként, és visszaadja azt két számjeggyel ábrázolva.
   * Ha a bemeneti szám kisebb, mint 10, akkor hozzáad egy nullát.
   * Ha a bemeneti szám 10 vagy nagyobb, akkor visszaadja a számot változatlan formában.
   *
   * @param {number} szam - A formázandó szám.
   * @returns {string} A szám, két számjeggyel ábrázolva.
   */
  const ketSzamjegy = (szam) => {
    return szam < 10 ? "0" + szam : szam;
  };

  /**
   * Egy tömb, ami az alkalmazásban használt útvonalakat tartalmazza a navigációhoz.
   * Minden objektum egy útvonalat reprezentál és két tulajdonsága van:
   * - `path`: Az útvonal URL-je.
   * - `label`: A navigációs link szövege az útvonalhoz.
   *
   * @type {Array<{path: string, label: string}>}
   */
  const utvonalak = [
    { path: "kezelok", label: "Kezelők" },
    { path: "allomasok", label: "Állomások" },
    { path: "jarmuTipusok", label: "Járműtípusok" },
    { path: "vonalak", label: "Vonalak" },
    { path: "inditasok", label: "Indítások" },
    { path: "megallok", label: "Megállok" },
  ];

  /**
   * Egy Layout komponens, ami egy navigációs sávot és az alkalmazás jeleti tartalmát rendereli.
   * A navigációs sáv linkeket tartalmaz a `utvonalak` tömbben definiált különböző útvonalakat jeleníti meg.
   * Továbbá a navigációs sávban megjeleníti a felhasználó nevét, kijelentkezés ikont és a maradék időt a kijelentkezésig.
   *
   * @component
   *
   * @returns {JSX.Element} Egy Navbar komponenst, ami tartalmazza a navigációs sávhoz tartozó összes menüpontot és az oldal tartalmát.
   */
  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
        <Container>
          {`${ketSzamjegy(Math.floor(maradekIdo / 60000))}:${ketSzamjegy(
            Math.floor(maradekIdo / 1000) % 60
          )}`}
          <Navbar.Brand>
            <LogoutIcon />
            {window.localStorage.getItem("felhasznalo")}
          </Navbar.Brand>
          <DarkModeSwitch />
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {utvonalak.map((route) => (
                <Nav.Link as={Link} key={route.path} to={route.path}>
                  {route.label}
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default Layout;
