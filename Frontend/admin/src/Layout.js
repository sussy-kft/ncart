import { Outlet, Link, redirect } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import FormCheck from 'react-bootstrap/FormCheck';
import { DarkModeContext } from "./context/DarkModeContext";
import { useContext } from "react";
import * as Icon from 'react-bootstrap-icons';
import { MetaadatContext } from "./context/MetaadatContext";
import { useNavigate } from "react-router-dom";

function Layout() {
  const { getText } = useContext(DarkModeContext);
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" >
        <Container>
          <Navbar.Brand>
            <Icon.DoorOpenFill
              color="#ff4040"
              title="Kijelentkezés"
              size={20}
              onClick={() => {
                window.sessionStorage.removeItem('felhasznalo');
                window.localStorage.removeItem('token');
                navigate('/login');
              }}
              style={{ marginRight: "10px", cursor: "pointer"}}
            />{window.sessionStorage.getItem('felhasznalo')}
          </Navbar.Brand>
          <div className="order-lg-1 d-flex align-items-center">
            <FormCheck

              style={{ marginRight: "10px", marginLeft: "auto" }}
              type="switch"
              onClick={() => { setDarkMode(darkMode === "dark" ? "light" : "dark") }}
            />
            {
              getText() === "light"
                ? <Icon.MoonFill
                  color="dark"
                  size={20}
                  className="ml-4 order-lg-1"
                  style={{ marginRight: "20px", marginLeft: "auto" }}
                />
                : <Icon.SunFill
                  color="white"
                  size={20}
                  className="ml-4 order-lg-1"
                  style={{ marginRight: "20px", marginLeft: "auto" }}
                />
            }
          </div>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} key="kezelok" to="kezelok">
                Kezelők
              </Nav.Link>
              <Nav.Link as={Link} key="allomasok" to="allomasok">
                Állomások
              </Nav.Link>
              <Nav.Link as={Link} key="jarmuTipusok" to="jarmuTipusok">
                Járműtípusok
              </Nav.Link>
              <Nav.Link as={Link} key="vonalak" to="vonalak">
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
