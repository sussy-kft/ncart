import { Outlet, Link } from "react-router-dom";

function Layout()
{
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link reloadDocument key="kezelok" to="/kezelok">Kezelők</Link>
          </li>
          <li>
            <Link reloadDocument key="allomasok" to="/allomasok">Állomások</Link>
          </li>
          <li>
            <Link reloadDocument key="jarmuTipusok" to="/jarmuTipusok">Jármű típusok</Link>
          </li>
          <li>
            <Link reloadDocument key="vonalak" to="/vonalak">Vonalak</Link>
          </li>
          <li>
            <Link reloadDocument key="inditasok" to="inditasok">Indítások</Link>
          </li>
          <li>
            <Link reloadDocument key="megallok" to="megallok">Megállok</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  )
};

export default Layout;
