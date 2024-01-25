using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    public class JsonRecieverController : ControllerContext
    {
        public JsonRecieverController(AppDbContext context) : base(context)
        {

        }

        protected ActionResult CheckIfBadRequest(Func<ActionResult> handleRequest) => ModelState.IsValid ? handleRequest() : BadRequest(ModelState);
    }
}
