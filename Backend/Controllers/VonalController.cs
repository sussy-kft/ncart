using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("vonalak")]
    public class VonalController : TablaController<Vonal, VonalDTO>
    {
        public VonalController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<VonalDTO> Get() => Get(context.Vonalak);

        [HttpGet("{id}")]
        public IActionResult Get(int id) => Get(context.Vonalak, id);

        public override IActionResult Post([FromBody] VonalDTO data) => Post(context.Vonalak, data);

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] VonalDTO ujVonal) => Put(
            dbSet: context.Vonalak,
            data: ujVonal,
            updateRecord: (vonal, ujVonal) => {
                vonal.VonalSzam = ujVonal.VonalSzam;
                vonal.JarmuTipus = ujVonal.JarmuTipus;
                vonal.KezdoAll = ujVonal.KezdoAll;
                vonal.Vegall = ujVonal.Vegall;
            },
            pk: id
        );

        public override IActionResult Delete() => DeleteAll(context.Vonalak);

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Delete(context.Vonalak, id);
    }
}
