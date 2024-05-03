using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    // Ez az osztály a front-end oldali api kérés rendszer tesztelésére szolgál
    [Route("test")]
    public class TestController() : ApiController()
    {
        [HttpGet]
        public ActionResult Get() => Ok("xd");

        [HttpPost]
        public ActionResult Post() => Ok("xd");

        [HttpPut]
        public ActionResult Put() => Ok("xd");

        [HttpPatch]
        public ActionResult Patch() => Ok("xd");

        [HttpDelete]
        public ActionResult Delete() => Ok("xd");
    }
}
