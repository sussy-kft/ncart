import React from "react";

/**
 * @description Egy React komponens, ami egy iframe-et jelenít meg.
 * Az iframe a "/docs/index.html" helyen található HTML dokumentumot jeleníti meg.
 *
 * @component
 * @returns {React.Element} Az `iframe`-et adja vissza, amely a dokumentációs oldalt jeleníti meg.
 */
function Documentacio() {
  return (
    <iframe
      src="/docs/index.html"
      title="Dokumentáció"
      width="100%"
      style={{
        height: "calc(100vh - 62px)",
        border: "none",
      }}
    >
      Dokumentáció betöltése...
    </iframe>
  );
}

export default Documentacio;
