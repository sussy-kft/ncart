using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("jarmutipusok")]
    public class JarmuTipusController : TablaController<JarmuTipus, JarmuTipusDTO>
    {
        public JarmuTipusController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<JarmuTipusDTO> Get() => Get(context.JarmuTipusok);

        [HttpGet("{id}")]
        public ActionResult Get(int id) => Get(context.JarmuTipusok, id);

        public override ActionResult Post([FromBody] JarmuTipusDTO data) => Post(context.JarmuTipusok, data);
        
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] JarmuTipusDTO ujJarmuTipus) => Put(
            dbSet: context.JarmuTipusok,
            data: ujJarmuTipus,
            updateRecord: (jarmuTipus, ujJarmuTipus) => {
                jarmuTipus.Megnevezes = ujJarmuTipus.Megnevezes;
            },
            pk: id
        );

        public override ActionResult Delete() => DeleteAll(context.JarmuTipusok);

        [HttpDelete("{id}")]
        public ActionResult Delete(int id) => Delete(context.JarmuTipusok, id);
    }
}
