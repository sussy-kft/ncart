import Admin from "./Admin";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bejelentkezes from "./login/Bejelentkezes";
import { DarkModeProvider } from "./context/DarkModeContext";
import { AxiosProvider } from "./context/AxiosContext";
import { MetaadatProvider } from "./context/MetaadatContext";
import React from "react";

function App() {
  const location = window.location.pathname;
  const [felhasznalo, setFelhasznalo] = React.useState();

  return (
    
    <div className="App">
      {/* {location === "/" ? (
        <iframe
          src="http://localhost:42069/index.html"
          title="External HTML"
          style={{ width: "100%", height: "100vh" }}
        />
      ) : ( */}
      <DarkModeProvider>
        <AxiosProvider>
          <MetaadatProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Bejelentkezes />} />
                <Route path="/admin/*" element={<Admin />} />
              </Routes>
            </Router>
          </MetaadatProvider>
        </AxiosProvider>
      </DarkModeProvider>
      {/* )} */}
    </div>
  );
}

export default App;
