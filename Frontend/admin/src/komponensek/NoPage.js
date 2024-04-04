import NoPageMedia from "../media/Metro_404.mp4";

function NoPage()
{
    return (
        <div style={{backgroundColor: "#3a3a3a"}}>
        <video autoPlay loop muted style={{height: "calc(100vh - 61px)", aspectRatio:"16/9", objectFit: "cover", zIndex: "-1"}}>
            <source src={NoPageMedia} type="video/mp4" />
        </video>
        </div>
    );
}

export default NoPage;