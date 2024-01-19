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
        public IActionResult Get(int id) => Get(context.Kezelok, record => record, id);

        public override IActionResult Post([FromBody] KezeloNyersEngedelyekkel data) => Post(context.Kezelok, data, data => data);

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] KezeloNyersEngedelyekkel ujKezelo) => Put(
            dbSet: context.Kezelok,
            updateRecord: kezelo => {
                Kezelo k = ujKezelo;
                kezelo.Email = k.Email;
                kezelo.Jelszo = k.Jelszo;
                kezelo.Engedelyek = k.Engedelyek;
                return kezelo;
            },
            pk: id
        );

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Delete(context.Kezelok, record => record, id);
    }
}
