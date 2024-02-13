using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    public abstract class JsonRecieverController(AppDbContext context) : ControllerContext(context)
    {
        protected ActionResult CheckIfBadRequest(Func<ActionResult> handleRequest) => ModelState.IsValid ? handleRequest() : BadRequest(ModelState);
    }
}
