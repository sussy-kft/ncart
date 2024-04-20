using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    // Ez az osztály a front-end oldali api kérés rendszer tesztelésére szolgál
    [Route("test")]
    public class TestController() : ApiController()
    {
        [HttpGet]
        public ActionResult Get() => Ok();

        [HttpPost]
        public ActionResult Post() => Ok();

        [HttpPut]
        public ActionResult Put() => Ok();

        [HttpPatch]
        public ActionResult Patch() => Ok();

        [HttpDelete]
        public ActionResult Delete() => Ok();
    }
}
