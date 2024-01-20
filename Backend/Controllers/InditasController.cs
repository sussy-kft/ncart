using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("inditasok")]
    public class InditasController : TablaController<Inditas, InditasDTO>
    {
        public InditasController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<InditasDTO> Get() => Get(context.Inditasok);

        [HttpGet("{vonal}/{nap}/{inditasIdeje}")]
        public IActionResult Get(int vonal, byte nap, short inditasIdeje) => Get(context.Inditasok, vonal, nap, inditasIdeje);

        public override IActionResult Post([FromBody] InditasDTO data) => Post(context.Inditasok, data);

        public override IActionResult Delete() => DeleteAll(context.Inditasok);

        [HttpDelete("{vonal}/{nap}/{inditasIdeje}")]
        public IActionResult Delete(int vonal, byte nap, short inditasIdeje) => Delete(context.Inditasok, vonal, nap, inditasIdeje);
    }
}
