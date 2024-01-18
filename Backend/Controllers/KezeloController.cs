using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("kezelok")]
    public class KezeloController : TablaController<Kezelo, KezeloNyersEngedelyekkel>
    {
        public KezeloController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<KezeloNyersEngedelyekkel> Get() => context.Kezelok.ToList().ConvertAll<KezeloNyersEngedelyekkel>(kezelo => kezelo);

        [HttpGet("{id}")]
        public IActionResult Get(int id) => Get(context.Kezelok, id);

        public override IActionResult Post([FromBody] KezeloNyersEngedelyekkel data) => Post(() => {
            Kezelo kezelo = data;
            context.Kezelok.Add(kezelo);
            context.SaveChanges();
            return Ok(kezelo);
        });

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] KezeloNyersEngedelyekkel ujKezelo) => Put(
            dbSet: context.Kezelok,
            updateData: kezelo => {
                Kezelo k = ujKezelo;
                kezelo.Email = k.Email;
                kezelo.Jelszo = k.Jelszo;
                kezelo.Engedelyek = k.Engedelyek;
                context.SaveChanges();
                return Ok((KezeloNyersEngedelyekkel)kezelo);
            },
            pk: id
        );

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Delete(context.Kezelok, id);
    }
}
