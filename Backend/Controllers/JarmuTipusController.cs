using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("jarmutipusok"), Authorize(Policy = nameof(KezeloController.Engedelyek.JaratokSzerkesztese))]
    public class JarmuTipusController(AppDbContext context, IConfiguration config) : TablaController<int, JarmuTipus, JarmuTipusDTO>(context, config)
    {
        protected override DbSet<JarmuTipus> dbSet => context.JarmuTipusok;

        public override IEnumerable<JarmuTipusDTO> Get() => PerformGetAll();

        [HttpGet("{id}")]
        public override ActionResult Get([FromRoute] int id) => PerformGet(id);

        public override ActionResult Post([FromBody] JarmuTipusDTO data) => PerformPost(data);

        public override ActionResult Delete() => PerformDeleteAll();

        [HttpDelete("{id}")]
        public override ActionResult Delete([FromRoute] int id) => PerformDelete(id);

        public override IEnumerable<IMetadataDTO<object>> GetMetadata() => PerformGetMetadata(nameof(AppDbContext.JarmuTipusok));
    }
}
