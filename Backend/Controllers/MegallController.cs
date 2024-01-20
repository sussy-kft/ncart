using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("megallok")]
    public class MegallController : TablaController<Megall, MegallDTO>
    {
        public MegallController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<MegallDTO> Get() => Get(context.Megallok);

        [HttpGet("{vonal}/{allomas}")]
        public IActionResult Get(int vonal, int allomas) => Get(context.Megallok, vonal, allomas);

        public override IActionResult Post([FromBody] MegallDTO data) => Post(context.Megallok, data);

        [HttpPut("{vonal}/{allomas}")]
        public IActionResult Put(int vonal, int allomas, [FromBody] MegallDTO ujMegall) => Put(
            dbSet: context.Megallok,
            data: ujMegall,
            updateRecord: (megall, ujMegall) => {
                megall.ElozoMegallo = ujMegall.ElozoMegallo;
                megall.HanyPerc = ujMegall.HanyPerc;
            },
            pk: (vonal, allomas)
        );

        public override IActionResult Delete() => DeleteAll(context.Megallok);

        [HttpDelete("{vonal}/{allomas}")]
        public IActionResult Delete(int vonal, int allomas) => Delete(context.Megallok, vonal, allomas);
    }
}
