using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    public abstract class ControllerContext(AppDbContext context, IConfiguration config) : ControllerBase()
    {
        protected AppDbContext context { get; } = context;
        protected IConfiguration config { get; } = config;

        protected TResult HandleError<TResult>(Func<TResult> func) where TResult : ActionResult
        {
            try
            {
                return func();
            }
            catch (Exception e)
            {
                return StatusCode(500, e.InnerException?.Message) as TResult;
            }
        }
    }
}
