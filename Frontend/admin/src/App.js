import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import NoPage from "./komponensek/NoPage";
import SzerkesztoOldal from "./komponensek/SzerkesztoOldal";
import Megallok from "./komponensek/Megallok";
import 'bootstrap/dist/css/bootstrap.css';
import { DarkModeProvider } from "./context/DarkModeContext";
import { AxiosProvider } from "./context/AxiosContext";

function App() {
  return (
    <div className="App" >
      <DarkModeProvider>
        <AxiosProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route key="kezelok" path="/kezelok" element={<SzerkesztoOldal cim={"Kezelők"} url={"kezelok"} />} />
                <Route key="jarmutipusok" path="/jarmutipusok" element={<SzerkesztoOldal cim={"Járműtípusok"} url={"jarmutipusok"} />} />
                <Route key="vonalak" path="/vonalak" element={<SzerkesztoOldal cim={"Vonalak"} url={"vonalak"} />} />
                <Route key="allomasok" path="/allomasok" element={<SzerkesztoOldal cim={"Állomások"} url={"allomasok"} />} />
                <Route key="inditasok" path="/inditasok" element={<SzerkesztoOldal cim={"Indítások"} url={"inditasok"} />} />
                <Route key="megallok" path="/megallok" element={<Megallok />} />
                <Route path="*" element={<NoPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AxiosProvider>
      </DarkModeProvider>
    </div>
  );
}

export default App;
