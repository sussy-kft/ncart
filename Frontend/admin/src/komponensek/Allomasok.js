import InfoPanel from "./InfoPanel";
import Lekerdezes from "./Lekerdezes";

function Allomasok()
{
    return (
        <>
            <div>Állomások</div>
            <Lekerdezes url={"allomasok"}/>
            <InfoPanel/>
        </>
    );
}

export default Allomasok;