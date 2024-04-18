using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("allomasok"), Authorize(Policy = nameof(KezeloController.Engedelyek.JaratokSzerkesztese))]
    public partial class AllomasController(AppDbContext context, IConfiguration config) : TablaController<int, Allomas, AllomasDTO>(context, config)
    {
        protected override DbSet<Allomas> dbSet => context.Allomasok;

        public override IEnumerable<AllomasDTO> Get() => PerformGetAll();

        [HttpGet("{id}")]
        public override ActionResult Get([FromRoute] int id) => PerformGet(id);

        public override ActionResult Post([FromBody] AllomasDTO data) => PerformPost(data);

        public override ActionResult Delete() => PerformDeleteAll();

        [HttpDelete("{id}")]
        public override ActionResult Delete([FromRoute] int id) => PerformDelete(id);

        public override IEnumerable<IMetadataDTO<object>> GetMetadata() => PerformGetMetadata(nameof(AppDbContext.Allomasok))
            .OverrideDataType<IEnumerable<MetadataDTO<string>>>(metadataDTO => metadataDTO.ColumnName == "Koord", _ => [
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
        public ActionResult Patch([FromRoute] int id, [FromBody] AllomasPatch ujAllomas) => PerformPatch(
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
