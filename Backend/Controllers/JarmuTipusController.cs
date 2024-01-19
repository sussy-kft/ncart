using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("jarmutipusok")]
    public class JarmuTipusController : TablaController<JarmuTipus, JarmuTipus>
    {
        public JarmuTipusController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<JarmuTipus> Get() => context.JarmuTipusok.ToList();

        [HttpGet("{id}")]
        public IActionResult Get(int id) => Get(context.JarmuTipusok, record => record, id);

        public override IActionResult Post([FromBody] JarmuTipus data) => Post(context.JarmuTipusok, data, data => data);
        
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] JarmuTipus ujJarmuTipus) => Put(
            dbSet: context.JarmuTipusok,
            updateRecord: jarmuTipus => {
                jarmuTipus.Megnevezes = ujJarmuTipus.Megnevezes;
                return jarmuTipus;
            },
            pk: id
        );

        [HttpDelete("{id}")]
        public IActionResult Delete(int id) => Delete(context.JarmuTipusok, record => record, id);
    }
}
