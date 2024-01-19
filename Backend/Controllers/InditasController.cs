using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("inditasok")]
    public class InditasController : TablaController<Inditas, Inditas>
    {
        public InditasController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<Inditas> Get() => context.Inditasok.ToList();

        [HttpGet("{vonal}/{nap}/{inditasIdeje}")]
        public IActionResult Get(int vonal, byte nap, short inditasIdeje) => Get(context.Inditasok, record => record, vonal, nap, inditasIdeje);

        public override IActionResult Post([FromBody] Inditas data) => Post(context.Inditasok, data, data => data);

        [HttpDelete("{vonal}/{nap}/{inditasIdeje}")]
        public IActionResult Delete(int vonal, byte nap, short inditasIdeje) => Delete(context.Inditasok, record => record, vonal, nap, inditasIdeje);
    }
}
