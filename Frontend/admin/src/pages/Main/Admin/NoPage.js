import NoPageMedia from "../../../media/Metro_404.mp4";

/**
 *
 * @description A NoPage komponens egy videót jelenít meg, amikor egy oldal nem található (404).
 * A videó automatikusan elindul, ismétlődik és némítva van.
 * A videó szélessége kitölti a konténer teljes szélességét, és megőrzi 16:9-es képarányát.
 * A videó magassága kitölti a (minusz 56px a navbar miatt) megmaradó helyet.
 *
 * @function NoPage
 * @returns {JSX.Element} Egy div elem, amely egy videót tartalmaz.
 */

function NoPage() {
  document.title = "404 - Az oldal nem található";

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
        data-testid="video"
        muted={true}
        autoPlay
        loop
        style={{ maxWidth: "100%", objectFit: "contain" }}
      >
        <source src={NoPageMedia} type="video/mp4" />
      </video>
    </div>
  );
}

export default NoPage;
