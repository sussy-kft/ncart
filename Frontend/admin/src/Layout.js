import { Outlet, Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import FormCheck from 'react-bootstrap/FormCheck';
import { DarkModeContext } from "./context/DarkModeContext";
import { useContext } from "react";

function Layout()
{
  const {getText} = useContext(DarkModeContext);
  const {darkMode, setDarkMode} = useContext(DarkModeContext);

  return (
    <>
       <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" >
          <Container>
          <Navbar.Brand>Brand text</Navbar.Brand>
          <FormCheck 
              className="order-lg-1"
              style={{marginRight: "20px", marginLeft: "auto"}}
              type="switch"
              label= {(getText() === "dark" ? "Világos" : "Sötét") + " mód"}
              onClick={() => { setDarkMode(darkMode === "dark" ? "light" : "dark")} }
              />
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} key="kezelok" to="/kezelok">
                Kezelők
              </Nav.Link>
              <Nav.Link as={Link} key="allomasok" to="/allomasok">
                Állomások
              </Nav.Link>
              <Nav.Link as={Link} key="jarmuTipusok" to="/jarmuTipusok">
                Jármű típusok
              </Nav.Link>
              <Nav.Link as={Link} key="vonalak" to="/vonalak">
                Vonalak
              </Nav.Link>
              <Nav.Link as={Link} key="inditasok" to="inditasok">
                Indítások
              </Nav.Link>
              <Nav.Link as={Link} key="megallok" to="megallok">
                Megállok
              </Nav.Link>
            </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      <Outlet />
    </>
  )
};

export default Layout;
