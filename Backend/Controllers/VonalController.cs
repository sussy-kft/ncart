using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("vonalak")]
    public partial class VonalController(AppDbContext context) : TablaController<int, Vonal, VonalDTO>(context)
    {
        public override IEnumerable<VonalDTO> Get() => GetAll(context.Vonalak);

        [HttpGet("{id}")]
        public override ActionResult Get([FromRoute] int id) => Get(context.Vonalak, id);

        public override ActionResult Post([FromBody] VonalDTO data) => Post(context.Vonalak, data);

        [HttpPut("{id}")]
        public override ActionResult Put([FromRoute] int id, [FromBody] VonalDTO ujVonal) => Put(
            dbSet: context.Vonalak,
            data: ujVonal,
            updateRecord: (vonal, ujVonal) => {
                vonal.VonalSzam = ujVonal.VonalSzam;
                vonal.JarmuTipus = ujVonal.JarmuTipus;
                vonal.KezdoAll = ujVonal.KezdoAll;
                vonal.Vegall = ujVonal.Vegall;
            },
            pk: id
        );

        public override ActionResult Delete() => DeleteAll(context.Vonalak);

        [HttpDelete("{id}")]
        public override ActionResult Delete([FromRoute] int id) => Delete(context.Vonalak, id);

        public override IEnumerable<IMetadataDTO<object>> Metadata() => Metadata<object>("Vonalak");
    }

    public partial class VonalController : IPatchableIdentityPkTablaController<VonalController.VonalPatch>
    {
        [HttpPatch("{id}")]
        public ActionResult Patch([FromRoute] int id, [FromBody] VonalPatch ujVonal) => Patch(
            dbSet: context.Vonalak,
            updateRecord: record => {
                CheckIfNotNull(ujVonal.VonalSzam, vonalSzam => {
                    record.VonalSzam = vonalSzam;
                });
                CheckIfNotNull(ujVonal.JarmuTipus, jarmuTipus => {
                    record.JarmuTipus = jarmuTipus;
                });
                CheckIfNotNull(ujVonal.KezdoAll, kezdoAll => {
                    record.KezdoAll = kezdoAll;
                });
                CheckIfNotNull(ujVonal.Vegall, vegall => {
                    record.Vegall = vegall;
                });
            },
            pk: id
        );

        public class VonalPatch
        {
            [MaxLength(4)] public string? VonalSzam { get; set; }
            public int? JarmuTipus { get; set; }
            public int? KezdoAll { get; set; }
            public int? Vegall { get; set; }
        }
    }

    public partial class VonalController
    {
        [HttpGet("vonalszamok")]
        public IEnumerable<string> GetVonalSzamok() => context
            .Vonalak
            .Select(vonal => vonal.VonalSzam)
            .Distinct()
        ;
    }
}
