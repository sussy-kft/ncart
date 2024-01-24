using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("allomasok")]
    public class AllomasController : KulonModosithatoTablaController<Allomas, AllomasDTO>
    {
        public AllomasController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<AllomasDTO> Get() => GetAll(context.Allomasok);

        [HttpGet("{id}")]
        public ActionResult Get(int id) => Get(context.Allomasok, id);

        public override ActionResult Post([FromBody] AllomasDTO data) => Post(context.Allomasok, data);

        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] AllomasDTO ujAllomas) => Put(
            dbSet: context.Allomasok,
            data: ujAllomas,
            updateRecord: (allomas, ujAllomas) => {
                allomas.Nev = ujAllomas.Nev;
                allomas.Koord = ujAllomas.Koord;
            },
            pk: id
        );

        [HttpPatch("{id}")]
        public ActionResult Patch(int id, [FromBody] AllomasPatchDTO ujAllomas) => Patch(
            dbSet: context.Allomasok,
            updateRecord: record => {
                CheckIfNotNull(ujAllomas.Nev, nev => {
                    record.Nev = nev;
                });
                CheckIfNotNull(ujAllomas.Koord, koord => {
                    record.Koord = koord;
                });
            },
            pk: id
        );

        public override ActionResult Delete() => DeleteAll(context.Allomasok);

        [HttpDelete("{id}")]
        public ActionResult Delete(int id) => Delete(context.Allomasok, id);
    }
}
