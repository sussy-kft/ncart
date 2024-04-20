using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    public abstract class JsonRecieverController() : ApiController()
    {
        protected ActionResult CheckIfBadRequest(Func<ActionResult> handleRequest) => HandleError(() => ModelState.IsValid ? handleRequest() : BadRequest(ModelState));
    }
}
