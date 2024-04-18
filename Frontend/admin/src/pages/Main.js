import "bootstrap/dist/css/bootstrap.css";
import Admin from "./Admin";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bejelentkezes from "./Login/Bejelentkezes";
import Providerek from "../HOC/Providerek";

/**
 * Egy komponens, ami az alkalmazás különböző context providerekkel és "/login" és "/admin/*" útvonalakkal rendelkezik.
 *
 * @returns {React.Component} Az alkalmazás fő komponensét adja vissza, ami a context providerekkel és útvonalakkal van beágyazva.
 */
function Main() {
  return (
    <div className="App">
      <Providerek>
        <Router>
          <Routes>
            <Route path="/login" element={<Bejelentkezes />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </Router>
      </Providerek>
    </div>
  );
}

export default Main;
