using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    public abstract class JsonRecieverController : ControllerContext
    {
        protected JsonRecieverController(AppDbContext context) : base(context)
        {

        }

        protected ActionResult CheckIfBadRequest(Func<ActionResult> handleRequest) => ModelState.IsValid ? handleRequest() : BadRequest(ModelState);
    }
}
