using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("allomasok")]
    public class AllomasController : TablaController<Allomas, AllomasDTO>
    {
        public AllomasController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<AllomasDTO> Get() => Get(context.Allomasok);

        [HttpGet("{id}")]
        public IActionResult Get(int id) => Get(context.Allomasok, id);

        public override IActionResult Post([FromBody] AllomasDTO data) => Post(context.Allomasok, data);

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] AllomasDTO ujAllomas) => Put(
            dbSet: context.Allomasok,
            data: ujAllomas,
            updateRecord: (allomas, ujAllomas) => {
                allomas.Nev = ujAllomas.Nev;
                allomas.Koord = ujAllomas.Koord;
            },
            pk: id
        );

        public override IActionResult Delete() => DeleteAll(context.Allomasok);

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Delete(context.Allomasok, id);
    }
}
