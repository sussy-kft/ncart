import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import NoPage from "./komponensek/NoPage";
import Kezelok from "./komponensek/Kezelok";
import JarmuTipusok from "./komponensek/JarmuTipusok";
import Vonalak from "./komponensek/Vonalak";
import Allomasok from "./komponensek/Allomasok";
import Inditasok from "./komponensek/Inditasok";
import Megallok from "./komponensek/Megallok";
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/kezelok" element={<Kezelok />} />
            <Route path="/jarmuTipusok" element={<JarmuTipusok />} />
            <Route path="/vonalak" element={<Vonalak />} />
            <Route path="/allomasok" element={<Allomasok />} />
            <Route path="/inditasok" element={<Inditasok />} />
            <Route path="/megallok" element={<Megallok />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
