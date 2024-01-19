using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("vonalak")]
    public class VonalController : TablaController<Vonal, Vonal>
    {
        public VonalController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<Vonal> Get() => context.Vonalak.ToList();

        [HttpGet("{id}")]
        public IActionResult Get(int id) => Get(context.Vonalak, record => record, id);

        public override IActionResult Post([FromBody] Vonal data) => Post(context.Vonalak, data, data => data);

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Vonal ujVonal) => Put(
            dbSet: context.Vonalak,
            updateRecord: vonal => {
                vonal.VonalSzam = ujVonal.VonalSzam;
                vonal.JarmuTipus = ujVonal.JarmuTipus;
                vonal.KezdoAll = ujVonal.KezdoAll;
                vonal.Vegall = ujVonal.Vegall;
                return vonal;
            },
            pk: id
        );

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Delete(context.Vonalak, record => record, id);
    }
}
