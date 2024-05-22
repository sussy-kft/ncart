using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    public interface IPatchableTableController<TPrimaryKey, TPatchFormat> where TPatchFormat : class
    {
        ActionResult Patch([FromRoute] TPrimaryKey pk, [FromBody] TPatchFormat data);
    }
}
