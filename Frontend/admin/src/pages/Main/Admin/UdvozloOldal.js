import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

/**
 * UdvozloOldal egy komponens, ami az üdvözlő oldalt jeleníti meg.
 *
 * Egy rövid üdvözlő üzenetet jelenít meg, amelyben röviden bemutatja az adminisztrációs felület funkcióit,
 * és egy linket a dokumentációs oldalra.
 *
 * @returns {JSX.Element} Az üdvözlő oldalt tartalmazó elem.
 */
function UdvozloOldal() {
  const location = useLocation();

  return (
    <div>
      <h1
        style={{
          marginTop: "50px",
          marginBottom: "20px",
        }}
      >
        Üdvözöljük az adminisztrációs felületen!
      </h1>
      <h5>
        Itt lehetősége van a menetrendek, járatok, állomások, járműtípusok és az
        admin felhasználók egyszerű és gyors kezelésére.
      </h5>
      <p className="text-muted">
        Ha esetleg segítségre lenne szüksége, vagy a redszerről több információt
        szeretne megtudni,
        <Link to={`${location.pathname}/dokumentacio`}>
          itt találja a dokumentációt.
        </Link>
      </p>
    </div>
  );
}

export default UdvozloOldal;
