using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("jarmutipusok"), Authorize(Policy = KezeloController.JaratokSzerkesztese)]
    public class JarmuTipusController(AppDbContext context, IConfiguration config) : TablaController<int, JarmuTipus, JarmuTipusDTO>(context, config)
    {
        public override IEnumerable<JarmuTipusDTO> Get() => GetAll(context.JarmuTipusok);

        [HttpGet("{id}")]
        public override ActionResult Get([FromRoute] int id) => Get(context.JarmuTipusok, id);

        public override ActionResult Post([FromBody] JarmuTipusDTO data) => Post(context.JarmuTipusok, data);

        [HttpPut("{id}")]
        public override ActionResult Put([FromRoute] int id, [FromBody] JarmuTipusDTO ujJarmuTipus) => Put(
            dbSet: context.JarmuTipusok,
            data: ujJarmuTipus,
            updateRecord: (jarmuTipus, ujJarmuTipus) => {
                jarmuTipus.Megnevezes = ujJarmuTipus.Megnevezes;
            },
            pk: id
        );

        public override ActionResult Delete() => DeleteAll(context.JarmuTipusok);

        [HttpDelete("{id}")]
        public override ActionResult Delete([FromRoute] int id) => Delete(context.JarmuTipusok, id);

        public override IEnumerable<IMetadataDTO<object>> Metadata() => Metadata("JarmuTipusok");
    }
}
