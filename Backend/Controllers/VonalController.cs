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
        public IActionResult Get(int id) => Get(context.Vonalak, id);

        public override IActionResult Post([FromBody] Vonal data) => Post(() => {
            context.Vonalak.Add(data);
            context.SaveChanges();
            return Ok(data);
        });

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Vonal ujVonal) => Put(
            dbSet: context.Vonalak,
            updateData: record => {
                record.VonalSzam = ujVonal.VonalSzam;
                record.JarmuTipus = ujVonal.JarmuTipus;
                record.KezdoAll = ujVonal.KezdoAll;
                record.Vegall = ujVonal.Vegall;
                context.SaveChanges();
                return Ok(record);
            },
            pk: id
        );

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Delete(context.Vonalak, id);
    }
}
