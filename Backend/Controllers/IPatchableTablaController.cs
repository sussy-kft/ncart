using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    public interface IPatchableTablaController<TPrimaryKey, TPatchFormat>
    {
        ActionResult Patch([FromRoute] TPrimaryKey pk, [FromBody] TPatchFormat data);
    }
}
