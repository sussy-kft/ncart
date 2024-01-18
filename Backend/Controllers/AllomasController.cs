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
        public IActionResult Get(int id) => Get(context.Allomasok, id);

        public override IActionResult Post([FromBody] AllomasNyersKoordinatakkal data) => Post(() => {
            context.Allomasok.Add(data);
            context.SaveChanges();
            return Ok(data);
        });

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] AllomasNyersKoordinatakkal ujAllomas) => Put(
            dbSet: context.Allomasok,
            updateData: record => {
                Allomas a = ujAllomas;
                record.Nev = a.Nev;
                record.Koord = a.Koord;
                context.SaveChanges();
                return Ok((AllomasNyersKoordinatakkal)record);
            },
            pk: id
        );

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Delete(context.Allomasok, id);
    }
}
