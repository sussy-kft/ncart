using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("allomasok")]
    public partial class AllomasController : TablaController<int, Allomas, AllomasDTO>
    {
        public AllomasController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<AllomasDTO> Get() => GetAll(context.Allomasok);

        public override ActionResult Post([FromBody] AllomasDTO data) => Post(context.Allomasok, data);

        public override ActionResult Delete() => DeleteAll(context.Allomasok);

        [HttpDelete("{id}")]
        public override ActionResult Delete([FromRoute] int id) => Delete(context.Allomasok, id);
    }

    public partial class AllomasController : IIdentityPkTablaController
    {
        [HttpGet("{id}")]
        public ActionResult Get([FromRoute] int id) => Get(context.Allomasok, id);
    }

    public partial class AllomasController : IPatchableIdentityPkTablaController<AllomasDTO, AllomasController.AllomasPatch>
    {
        [HttpPut("{id}")]
        public ActionResult Put([FromRoute] int id, [FromBody] AllomasDTO ujAllomas) => Put(
            dbSet: context.Allomasok,
            data: ujAllomas,
            updateRecord: (allomas, ujAllomas) => {
                allomas.Nev = ujAllomas.Nev;
                allomas.Koord = ujAllomas.Koord;
            },
            pk: id
        );

        [HttpPatch("{id}")]
        public ActionResult Patch([FromRoute] int id, [FromBody] AllomasPatch ujAllomas) => Patch(
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

        public class AllomasPatch
        {
            [MaxLength(64)] public string? Nev { get; set; }
            public AllomasDTO.Vector2? Koord { get; set; }
        }
    }
}
