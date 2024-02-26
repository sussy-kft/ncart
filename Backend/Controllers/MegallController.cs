using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    [Route("megallok")]
    public partial class MegallController(AppDbContext context) : BatchPostableController<(int vonal, int allomas), Megall, MegallDTO, MegallController.MegallBatch>(context)
    {
        public override IEnumerable<MegallDTO> Get() => GetAll(context.Megallok);

        [HttpGet("{vonal}/{allomas}")]
        public override ActionResult Get((int vonal, int allomas) pk) => Get(context.Megallok, pk.vonal, pk.allomas);

        public override ActionResult Post([FromBody] MegallDTO data) => Post(context.Megallok, data);

        [HttpPut("{vonal}/{allomas}")]
        public override ActionResult Put([FromRoute] (int vonal, int allomas) pk, [FromBody] MegallDTO ujMegall) => Put(
            dbSet: context.Megallok,
            data: ujMegall,
            updateRecord: (megall, ujMegall) => {
                megall.ElozoMegallo = ujMegall.ElozoMegallo;
                megall.HanyPerc = ujMegall.HanyPerc;
            },
            pk: (pk.vonal, pk.allomas)
        );

        public override ActionResult Delete() => DeleteAll(context.Megallok);

        [HttpDelete("{vonal}/{allomas}")]
        public override ActionResult Delete([FromRoute] (int vonal, int allomas) pk) => Delete(context.Megallok, pk.vonal, pk.allomas);
    }

    public partial class MegallController
    {
        public override ActionResult Post([FromBody] MegallBatch megallBatch) => Post(context.Megallok, megallBatch);

        public class MegallBatch : IConvertible<IReadOnlyList<Megall>>
        {
            [Required] public int Vonal { get; set; }

            [Required] public List<MegallBatchElem> Megallok { get; set; }

            public IReadOnlyList<Megall> ConvertType()
            {
                List<Megall> megallok = new List<Megall>();
                Megallok.ForEach(megall => {
                    megallok.Add(new Megall {
                        Vonal = Vonal,
                        Allomas = megall.Allomas,
                        ElozoMegallo = megall.ElozoMegallo,
                        HanyPerc = megall.HanyPerc
                    });
                });
                return megallok;
            }

            public class MegallBatchElem : MegallBase
            {
                [Required] public int Allomas { get; set; }
            }
        }
    }

    public partial class MegallController : IPatchableTablaController<(int vonal, int allomas), MegallController.MegallPatch>
    {
        [HttpPatch("{vonal}/{allomas}")]
        public ActionResult Patch([FromRoute] (int vonal, int allomas) pk, [FromBody] MegallPatch ujMegall) => Patch(
            dbSet: context.Megallok,
            updateRecord: record => {
                CheckIfNotNull(ujMegall.ElozoMegallo, elozoMegallo => {
                    record.ElozoMegallo = elozoMegallo;
                });
                CheckIfNotNull(ujMegall.HanyPerc, hanyPerc => {
                    record.HanyPerc = hanyPerc;
                });
            },
            pk: (pk.vonal, pk.allomas)
        );

        public class MegallPatch
        {
            public int? ElozoMegallo { get; set; }
            public byte? HanyPerc { get; set; }
        }
    }

    public partial class MegallController
    {
        [HttpGet("{vonalId}")]
        public ActionResult GetOdaVissza(int vonalId) => NotFoundIfQueryIsEmpty(() => context
            .Megallok
            .Where(megall => megall.Vonal == vonalId)
            .Select(megall => megall._Allomas)
            .ToList()
        );
    }
}
