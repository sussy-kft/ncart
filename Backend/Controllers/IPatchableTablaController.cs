using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    public interface IPatchableTablaController<TPrimaryKey, TPutFormat, TPatchFormat> : IPuttableTablaController<TPrimaryKey, TPutFormat>
    {
        ActionResult Patch([FromRoute] TPrimaryKey pk, [FromBody] TPatchFormat data);
    }
}
