using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    [Route("megallok")]
    public partial class MegallController : BatchPostableController<(int vonal, int allomas), Megall, MegallDTO, MegallController.MegallBatch>
    {
        public MegallController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<MegallDTO> Get() => GetAll(context.Megallok);

        public override ActionResult Post([FromBody] MegallDTO data) => Post(context.Megallok, data);

        public override ActionResult Delete() => DeleteAll(context.Megallok);

        [HttpDelete("{vonal}/{allomas}")]
        public override ActionResult Delete([FromRoute] (int vonal, int allomas) pk) => Delete(context.Megallok, pk.vonal, pk.allomas);
    }

    public partial class MegallController
    {
        [HttpGet("{vonal}/{allomas}")]
        public override ActionResult Get((int vonal, int allomas) pk) => Get(context.Megallok, pk.vonal, pk.allomas);
    }

    public partial class MegallController : IPatchableTablaController<(int vonal, int allomas), MegallController.MegallPatch>
    {
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
        public override ActionResult Post([FromBody] MegallBatch megallBatch) => Post(context.Megallok, megallBatch);

        public class MegallBatch : IConvertible<IReadOnlyList<Megall>>
        {
            [Required] public int Vonal { get; set; }

            [Required] public List<MegallBatchElem> Megallok { get; set; }

            public IReadOnlyList<Megall> ConvertType()
            {
                List<Megall> megallok = new List<Megall>();
                Megallok.ForEach(megall => {
                    megallok.Add(new Megall
                    {
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

    public partial class MegallController
    {
        [HttpGet("{vonalSzam}")]
        public ActionResult GetOdaVissza(string vonalSzam)
        {
            IReadOnlyList<VonalMegallok> vonalMegallok = context.Vonalak
                .Where(vonal => vonal.VonalSzam == vonalSzam)
                .Select(vonal => new VonalMegallok {
                    Vonal = vonal.Id,
                    Megallok = vonal._Megallok.Select(megall => megall.Allomas).ToList()
                })
                .ToList()
            ;
            return vonalMegallok.Count > 0
                ? Ok(vonalMegallok.Count == 1
                    ? new OdaVissza {
                        Oda = vonalMegallok[0]
                    }
                    : new OdaVissza {
                        Oda = vonalMegallok[0],
                        Vissza = vonalMegallok[1]
                    })
                : NotFound()
            ;
        }

        class OdaVissza
        {
            public VonalMegallok Oda { get; set; }
            public VonalMegallok? Vissza { get; set; }
        }

        class VonalMegallok
        {
            public int Vonal { get; set; }
            public List<int> Megallok { get; set; }
        }
    }
}
