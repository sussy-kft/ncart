using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Backend.Controllers
{
    [Route("allomasok")]
    public partial class AllomasController(AppDbContext context) : TablaController<int, Allomas, AllomasDTO>(context)
    {
        public override IEnumerable<AllomasDTO> Get() => GetAll(context.Allomasok);

        [HttpGet("{id}")]
        public override ActionResult Get([FromRoute] int id) => Get(context.Allomasok, id);

        public override ActionResult Post([FromBody] AllomasDTO data) => Post(context.Allomasok, data);

        [HttpPut("{id}")]
        public override ActionResult Put([FromRoute] int id, [FromBody] AllomasDTO ujAllomas) => Put(
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
        public override ActionResult Delete([FromRoute] int id) => Delete(context.Allomasok, id);

        public override IEnumerable<IMetadataDTO<object>> Metadata() => Metadata("Allomasok")
            .OverrideDataType<IReadOnlyList<MetadataDTO<string>>>(metadataDTO => metadataDTO.ColumnName == "Koord", _ => [
                new MetadataDTO<string> {
                    ColumnName = "X",
                    DataType = "float",
                    IsNullable = false,
                    IsPartOfPK = false,
                    References = null,
                    CharacterMaximumLength = null,
                    IsHidden = false
                },
                new MetadataDTO<string> {
                    ColumnName = "Y",
                    DataType = "float",
                    IsNullable = false,
                    IsPartOfPK = false,
                    References = null,
                    CharacterMaximumLength = null,
                    IsHidden = false
                }
            ])
        ;
    }

    public partial class AllomasController : IPatchableIdentityPkTablaController<AllomasController.AllomasPatch>
    {
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
