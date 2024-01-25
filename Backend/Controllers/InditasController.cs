using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("inditasok")]
    public partial class InditasController : BatchPostableController<Inditas, InditasDTO, InditasBatchDTO>
    {
        public InditasController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<InditasDTO> Get() => GetAll(context.Inditasok);

        public override ActionResult Post([FromBody] InditasDTO data) => Post(context.Inditasok, data);

        public override ActionResult Delete() => DeleteAll(context.Inditasok);

        [HttpDelete("{vonal}/{nap}/{inditasIdeje}")]
        public ActionResult Delete(int vonal, byte nap, short inditasIdeje) => Delete(context.Inditasok, vonal, nap, inditasIdeje);
    }

    public partial class InditasController
    {
        public override ActionResult Post([FromBody] InditasBatchDTO data) => Post(context.Inditasok, data);
    }
}
