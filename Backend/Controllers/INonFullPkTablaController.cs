using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    public interface INonFullPkTablaController<TPrimaryKey>
    {
        ActionResult Get([FromRoute] TPrimaryKey pk);
    }
}
