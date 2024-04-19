using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    public abstract class ControllerContext(AppDbContext context, IConfiguration config) : ControllerBase()
    {
        protected AppDbContext context { get; } = context;
        protected IConfiguration config { get; } = config;

        protected ActionResult HandleError(Func<ActionResult> func) => HandleError<ActionResult>(func);

        protected ObjectResult HandleError(Func<ObjectResult> func) => HandleError<ObjectResult>(func);

        /* Ez a metódus nem használható semmilyen más típusokkal, csak ActionResult és ObjectResult.
         * Ha bármilyen másik típussal használod, akkor ha a catch ágba lép a program (elvileg) egy InvalidTypeCast error-t dob,
         * ami ilyen formában nem kezelhető. Erre szolgál a fenti két metódus, hogy azok hard code-olva bebiztosítják ezt.
         */
        TResult HandleError<TResult>(Func<TResult> func) where TResult : ActionResult
        {
            try
            {
                return func();
            }
            catch (Exception e)
            {
                return (StatusCode(500, e.InnerException?.Message) as TResult)!;
            }
        }
    }
}
