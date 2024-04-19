using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("jarmutipusok"), Authorize(Policy = nameof(KezeloController.Engedelyek.JaratokSzerkesztese))]
    public partial class JarmuTipusController(AppDbContext context, IConfiguration config) : TablaController<int, JarmuTipus, JarmuTipusDTO>(context, config)
    {
        protected override string tableName => nameof(AppDbContext.JarmuTipusok);

        protected override DbSet<JarmuTipus> dbSet => context.JarmuTipusok;

        [HttpGet("{id}")]
        public override ActionResult Get([FromRoute] int id) => PerformGet(id);

        public override ActionResult Post([FromBody] JarmuTipusDTO data) => PerformPost(data);

        [HttpDelete("{id}")]
        public override ActionResult Delete([FromRoute] int id) => PerformDelete(id);
    }

    public partial class JarmuTipusController : IPatchableIdentityPkTablaController<JarmuTipusController.JarmuTipusPatch>
    {
        [HttpPatch("{id}")]
        public ActionResult Patch([FromRoute] int id, [FromBody] JarmuTipusPatch ujJarmuTipus) => PerformPatch(
            updateRecord: record => {
                CheckIfNotNull(ujJarmuTipus.Megnevezes, megnevezes => {
                    record.Megnevezes = megnevezes;
                });
            },
            pk: id
        );

        public class JarmuTipusPatch
        {
            [MaxLength(16)] public string? Megnevezes { get; set; }
        }
    }
}
