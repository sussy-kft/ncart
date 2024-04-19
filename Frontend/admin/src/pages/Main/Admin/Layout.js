import { Outlet, Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import LogoutIcon from "../../../komponensek/Layout/LogoutIcon";
import DarkModeSwitch from "../../../komponensek/Layout/DarkModeSwitch";

function Layout() {
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
   *
   * @component
   *
   * @returns {JSX.Element} Egy Navbar komponenst, ami tartalmazza a navigációs sávhoz tartozó összes menüpontot és az oldal tartalmát.
   */
  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand>
            <LogoutIcon />
            {window.sessionStorage.getItem("felhasznalo")}
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
