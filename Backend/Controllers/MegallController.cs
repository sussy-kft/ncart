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

        public override IEnumerable<IMetadataDTO<object>> Metadata() => Metadata<object>("Megallok");
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
        [HttpGet("vonalmegallok/{vonalSzam}/{jarmuTipus}")]
        public ActionResult GetOdaVissza(string vonalSzam, int jarmuTipus)
        {
            IReadOnlyList<Vonal> vonalak = context
                .Vonalak
                .Where(vonal => vonal.VonalSzam == vonalSzam && vonal.JarmuTipus == jarmuTipus)
                .ToList();
            ;
            int vonalakCount = vonalak.Count();
            return vonalakCount > 0
                ? ((Func<ActionResult>)(() => {
                    List<VonalMegallok> vonalMegallok = [];
                    try
                    {
                        vonalak.ToList().ForEach(vonal => {
                            vonalMegallok.Add(new VonalMegallok() {
                                Vonal = vonal,
                                Megallok = ((Func<List<Megall>>)(() => {
                                    IReadOnlyList<Megall> megallok = context
                                        .Megallok
                                        .Where(megall => megall.Vonal == vonal.Id)
                                        .ToList()
                                    ;
                                    List<Megall> rendezettMegallok = [megallok.SelectFirst(out Megall? elsoMegall, megall => megall.ElozoMegallo == vonal.KezdoAll) ? elsoMegall! : throw new InvalidOperationException()];
                                    int legutobbiAllomasId = rendezettMegallok[0].Allomas;
                                    while (legutobbiAllomasId != vonal.Vegall)
                                    {
                                        rendezettMegallok.Add(megallok.SelectFirst(out Megall? ujMegall, megall => megall.ElozoMegallo == legutobbiAllomasId) ? ujMegall! : throw new InvalidOperationException());
                                        legutobbiAllomasId = rendezettMegallok[^1].Allomas;
                                    }
                                    return rendezettMegallok;
                                }))()
                            });
                        });
                    }
                    catch (InvalidOperationException e)
                    {
                        return Status500;
                    }
                    return Ok(vonalakCount == 1
                        ? new OdaVissza() {
                            Oda = vonalMegallok[0]
                        }
                        : new OdaVissza() {
                            Oda = vonalMegallok[0],
                            Vissza = vonalMegallok[1]
                        }
                    );
                }))()
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
            public Vonal Vonal { get; set; }
            public List<Megall> Megallok { get; set; }
        }
    }
}
