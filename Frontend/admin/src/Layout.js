import { Outlet, Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";

function Layout()
{
  return (
    <>
       <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" >
          <Container>
          <Navbar.Brand>Brand text</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} reloadDocument key="kezelok" to="/kezelok">
                Kezelők
              </Nav.Link>
              <Nav.Link as={Link} reloadDocument key="allomasok" to="/allomasok">
                Állomások
              </Nav.Link>
              <Nav.Link as={Link} reloadDocument key="jarmuTipusok" to="/jarmuTipusok">
                Jármű típusok
              </Nav.Link>
              <Nav.Link as={Link} reloadDocument key="vonalak" to="/vonalak">
                Vonalak
              </Nav.Link>
              <Nav.Link as={Link} reloadDocument key="inditasok" to="inditasok">
                Indítások
              </Nav.Link>
              <Nav.Link as={Link} reloadDocument key="megallok" to="megallok">
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
