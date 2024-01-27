using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    public interface IPuttableTablaController<TPrimaryKey, TPutFormat>
    {
        ActionResult Put([FromRoute] TPrimaryKey pk, [FromBody] TPutFormat data);
    }
}
