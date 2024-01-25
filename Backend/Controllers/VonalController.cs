using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("vonalak")]
    public class VonalController : TablaController<Vonal, VonalDTO>
    {
        public VonalController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<VonalDTO> Get() => GetAll(context.Vonalak);

        [HttpGet("{id}")]
        public ActionResult Get(int id) => Get(context.Vonalak, id);

        public override ActionResult Post([FromBody] VonalDTO data) => Post(context.Vonalak, data);

        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] VonalDTO ujVonal) => Put(
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

        [HttpPatch("{id}")]
        public ActionResult Patch(int id, [FromBody] VonalPatchDTO ujVonal) => Patch(
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

        public override ActionResult Delete() => DeleteAll(context.Vonalak);

        [HttpDelete("{id}")]
        public ActionResult Delete(int id) => Delete(context.Vonalak, id);
    }
}
