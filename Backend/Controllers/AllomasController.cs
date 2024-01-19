using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("allomasok")]
    public class AllomasController : TablaController<Allomas, AllomasNyersKoordinatakkal>
    {
        public AllomasController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<AllomasNyersKoordinatakkal> Get() => context.Allomasok.ToList().ConvertAll<AllomasNyersKoordinatakkal>(allomas => allomas);

        [HttpGet("{id}")]
        public IActionResult Get(int id) => Get(context.Allomasok, record => record, id);

        public override IActionResult Post([FromBody] AllomasNyersKoordinatakkal data) => Post(context.Allomasok, data, data => data);

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] AllomasNyersKoordinatakkal ujAllomas) => Put(
            dbSet: context.Allomasok,
            updateRecord: allomas => {
                Allomas a = ujAllomas;
                allomas.Nev = a.Nev;
                allomas.Koord = a.Koord;
                return allomas;
            },
            pk: id
        );

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Delete(context.Allomasok, record => record, id);
    }
}
