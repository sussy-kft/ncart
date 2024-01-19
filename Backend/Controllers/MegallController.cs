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
        public IActionResult Get(int vonal, int allomas) => Get(context.Megallok, record => record, vonal, allomas);

        public override IActionResult Post([FromBody] Megall data) => Post(context.Megallok, data, data => data);

        [HttpPut("{vonal}/{allomas}")]
        public IActionResult Put(int vonal, int allomas, [FromBody] Megall ujMegall) => Put(
            dbSet: context.Megallok,
            updateRecord: megall => {
                megall.ElozoMegallo = ujMegall.ElozoMegallo;
                megall.HanyPerc = ujMegall.HanyPerc;
                return megall;
            },
            pk: (vonal, allomas)
        );

        [HttpDelete("{vonal}/{allomas}")]
        public IActionResult Delete(int vonal, int allomas) => Delete(context.Megallok, record => record, vonal, allomas);
    }
}
