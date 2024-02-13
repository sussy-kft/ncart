import { Outlet, Link } from "react-router-dom";

function Layout()
{
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/kezelok">Kezelők</Link>
          </li>
          <li>
            <Link to="/allomasok">Állomások</Link>
          </li>
          <li>
            <Link to="/jarmuTipusok">Jármű típusok</Link>
          </li>
          <li>
            <Link to="/vonalak">Vonalak</Link>
          </li>
          <li>
            <Link to="inditasok">Indítások</Link>
          </li>
          <li>
            <Link to="megallok">Megállok</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  )
};

export default Layout;
