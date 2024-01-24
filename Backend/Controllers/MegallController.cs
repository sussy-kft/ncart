using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("megallok")]
    public partial class MegallController : KulonModosithatoTablaController<Megall, MegallDTO>
    {
        public MegallController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<MegallDTO> Get() => GetAll(context.Megallok);

        [HttpGet("{vonal}/{allomas}")]
        public ActionResult Get(int vonal, int allomas) => Get(context.Megallok, vonal, allomas);

        public override ActionResult Post([FromBody] MegallDTO data) => Post(context.Megallok, data);

        [HttpPut("{vonal}/{allomas}")]
        public ActionResult Put(int vonal, int allomas, [FromBody] MegallDTO ujMegall) => Put(
            dbSet: context.Megallok,
            data: ujMegall,
            updateRecord: (megall, ujMegall) => {
                megall.ElozoMegallo = ujMegall.ElozoMegallo;
                megall.HanyPerc = ujMegall.HanyPerc;
            },
            pk: (vonal, allomas)
        );

        [HttpPatch("{vonal}/{allomas}")]
        public ActionResult Patch(int vonal, int allomas, [FromBody] MegallPatchDTO ujMegall) => Patch(
            dbSet: context.Megallok,
            updateRecord: record => {
                CheckIfNotNull(ujMegall.ElozoMegallo, elozoMegallo => {
                    record.ElozoMegallo = elozoMegallo;
                });
                CheckIfNotNull(ujMegall.HanyPerc, hanyPerc => {
                    record.HanyPerc = hanyPerc;
                });
            },
            pk: (vonal, allomas)
        );

        public override ActionResult Delete() => DeleteAll(context.Megallok);

        [HttpDelete("{vonal}/{allomas}")]
        public ActionResult Delete(int vonal, int allomas) => Delete(context.Megallok, vonal, allomas);
    }

    public partial class MegallController
    {
        [HttpPost("batch")]
        public ActionResult Post([FromBody] MegallBatch megallBatch) => CheckIfBadRequest(() => ModifyRange(megallBatch.ConvertType(), context.Megallok.AddRange));
    }
}
