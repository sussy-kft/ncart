import Admin from "./Admin";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bejelentkezes from "./komponensek/Bejelentkezes";

function App() {
  return (
    <div className="App" >
      <Router>
        <Routes>
          <Route path="/login" element={<Bejelentkezes />} />
          <Route path="/admin/*" element={<Admin/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
