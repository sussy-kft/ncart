import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import NoPage from "./komponensek/NoPage";
import SzerkesztoOldal from "./komponensek/SzerkesztoOldal";
import Megallok from "./komponensek/Megallok/Megallok";
import 'bootstrap/dist/css/bootstrap.css';
import { DarkModeProvider } from "./context/DarkModeContext";
import { AxiosProvider } from "./context/AxiosContext";
import { MetaadatProvider } from "./context/MetaadatContext";

function App() {
  return (
    <div className="App" >
      <DarkModeProvider>
        <AxiosProvider>
          <MetaadatProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route key="kezelok" path="/kezelok" element={<SzerkesztoOldal cim={"Kezelők"}/>} />
                  <Route key="jarmutipusok" path="/jarmutipusok" element={<SzerkesztoOldal cim={"Járműtípusok"}/>} />
                  <Route key="vonalak" path="/vonalak" element={<SzerkesztoOldal cim={"Vonalak"}/>} />
                  <Route key="allomasok" path="/allomasok" element={<SzerkesztoOldal cim={"Állomások"}/>} />
                  <Route key="inditasok" path="/inditasok" element={<SzerkesztoOldal cim={"Indítások"}/>} />
                  <Route key="megallok" path="/megallok" element={<SzerkesztoOldal cim={"Megállok"} child={<Megallok/>}/>} />
                  <Route path="*" element={<NoPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </MetaadatProvider>
        </AxiosProvider>
      </DarkModeProvider>
    </div>
  );
}

export default App;
