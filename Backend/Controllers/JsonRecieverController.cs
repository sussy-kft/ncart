using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    public abstract class JsonRecieverController(AppDbContext context, IConfiguration config) : ControllerContext(context, config)
    {
        protected ActionResult CheckIfBadRequest(Func<ActionResult> handleRequest) => HandleError(() => ModelState.IsValid ? handleRequest() : BadRequest(ModelState));
    }
}
