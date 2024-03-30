import Admin from "./Admin";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bejelentkezes from "./komponensek/Bejelentkezes";

function App() {
  const location = window.location.pathname;

  return (
    <div className="App">
      {location === "/" ? (
        <iframe
          src="http://localhost:42069/index.html"
          title="External HTML"
          style={{ width: "100%", height: "100vh" }}
        />
      ) : (
        <Router>
          <Routes>
            <Route path="/login" element={<Bejelentkezes />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
