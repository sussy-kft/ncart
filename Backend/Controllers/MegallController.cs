using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("megallok")]
    public class MegallController : TablaController<Megall, Megall>
    {
        public MegallController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<Megall> Get() => context.Megallok.ToList();

        [HttpGet("{vonal}/{allomas}")]
        public IActionResult Get(int vonal, int allomas) => Get(context.Megallok, vonal, allomas);

        public override IActionResult Post([FromBody] Megall data) => Post(() => {
            context.Megallok.Add(data);
            context.SaveChanges();
            return Ok(data);
        });

        [HttpPut("{vonal}/{allomas}")]
        public IActionResult Put(int vonal, int allomas, [FromBody] Megall ujMegall) => Put(
            dbSet: context.Megallok,
            updateData: record => {
                record.ElozoMegallo = ujMegall.ElozoMegallo;
                record.HanyPerc = ujMegall.HanyPerc;
                context.SaveChanges();
                return Ok(record);
            },
            pk: (vonal, allomas)
        );

        [HttpDelete("{vonal}/{allomas}")]
        public IActionResult Delete(int vonal, int allomas) => Delete(vonal, allomas);
    }
}
