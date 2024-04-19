import NoPageMedia from "../../../media/Metro_404.mp4";
import React, { useEffect } from "react";

/**
 *
 * A NoPage komponens egy videót jelenít meg, amikor egy oldal nem található (404).
 * A videó automatikusan elindul, ismétlődik és némítva van.
 * A videó szélessége kitölti a konténer teljes szélességét, és megőrzi 16:9-es képarányát.
 * A videó magassága kitölti a (minusz 56px a navbar miatt) megmaradó helyet.
 *
 * @function NoPage
 * @returns {JSX.Element} Egy div elem, amely egy videót tartalmaz.
 */

function NoPage() {
  document.title = "404 - Az oldal nem található";
  // useEffect(() => {
  //   // Beállítja az oldal címét: "404 - Az oldal nem található"

  //   // idk unatkoztam és írtam egy animációt a címre :D
  //   //   let cim = "🚌404 - Az oldal nem található";

  //   //   const titleInterval = setInterval(() => {
  //   //     cim = cim.slice(cim[0]===" "|| cim[0]+cim[1]==="🚌"?2:1) + cim.slice(0, cim[0]===" " || cim[0]+cim[1]==="🚌"?2:1);
  //   //     document.title = cim;
  //   //   }, 500);

  //   //   return () => {
  //   //     clearInterval(titleInterval);
  //   //   };
  // }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "calc(100vh - 56px)",
        backgroundColor: "#3a3a3a"
      }}
    >
      <video
        autoPlay
        loop
        muted
        style={{
          maxWidth: "100%",
          objectFit: "contain",
          aspectRatio: "16/9",
        }}
      >
        <source src={NoPageMedia} type="video/mp4" />
      </video>
    </div>
  );
}

export default NoPage;
