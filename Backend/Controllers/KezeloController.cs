using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("kezelok")]
    public class KezeloController : TablaController<Kezelo, KezeloDTO>
    {
        public KezeloController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<KezeloDTO> Get() => Get(context.Kezelok);

        [HttpGet("{id}")]
        public IActionResult Get(int id) => Get(context.Kezelok, id);

        public override IActionResult Post([FromBody] KezeloDTO data) => Post(context.Kezelok, data);

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] KezeloDTO ujKezelo) => Put(
            dbSet: context.Kezelok,
            data: ujKezelo,
            updateRecord: (kezelo, ujKezelo) => {
                kezelo.Email = ujKezelo.Email;
                kezelo.Jelszo = ujKezelo.Jelszo;
                kezelo.Engedelyek = ujKezelo.Engedelyek;
            },
            pk: id
        );

        public override IActionResult Delete() => DeleteAll(context.Kezelok);

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Delete(context.Kezelok, id);
    }
}
