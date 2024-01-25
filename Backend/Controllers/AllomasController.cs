using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("allomasok")]
    public partial class AllomasController : TablaController<Allomas, AllomasDTO>
    {
        public AllomasController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<AllomasDTO> Get() => GetAll(context.Allomasok);

        [HttpGet("{id}")]
        public ActionResult Get(int id) => this.Get(context.Allomasok, id);

        public override ActionResult Post([FromBody] AllomasDTO data) => Post(context.Allomasok, data);

        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] AllomasDTO ujAllomas) => this.Put(
            dbSet: context.Allomasok,
            data: ujAllomas,
            updateRecord: (allomas, ujAllomas) => {
                allomas.Nev = ujAllomas.Nev;
                allomas.Koord = ujAllomas.Koord;
            },
            pk: id
        );

        public override ActionResult Delete() => DeleteAll(context.Allomasok);

        [HttpDelete("{id}")]
        public ActionResult Delete(int id) => Delete(context.Allomasok, id);
    }

    public partial class AllomasController
    {
        [HttpPatch("{id}")]
        public ActionResult Patch(int id, [FromBody] AllomasPatch ujAllomas) => this.Patch(
            dbSet: context.Allomasok,
            updateRecord: record => {
                TablaControllerMetodusok.CheckIfNotNull(ujAllomas.Nev, nev => {
                    record.Nev = nev;
                });
                TablaControllerMetodusok.CheckIfNotNull(ujAllomas.Koord, koord => {
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
