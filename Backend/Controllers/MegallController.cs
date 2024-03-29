using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;
using Backend.ModelDTOBases;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("megallok")]
    public partial class MegallController(AppDbContext context) : BatchPostableController<MegallController.PK, Megall, MegallDTO, MegallController.MegallBatch>(context)
    {
        public class PK
        {
            public int vonal { get; set; }
            public int allomas { get; set; }
        }

        public override IEnumerable<MegallDTO> Get() => GetAll(context.Megallok);

        [HttpGet("{vonal}/{allomas}")]
        public override ActionResult Get([FromRoute] PK pk) => Get(context.Megallok, pk.vonal, pk.allomas);

        public override ActionResult Post([FromBody] MegallDTO data) => Post(context.Megallok, data);

        [HttpPut("{vonal}/{allomas}")]
        public override ActionResult Put([FromRoute] PK pk, [FromBody] MegallDTO ujMegall) => Put(
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
        public override ActionResult Delete([FromRoute] PK pk) => Delete(context.Megallok, pk.vonal, pk.allomas);

        public override IEnumerable<IMetadataDTO<object>> Metadata() => Metadata("Megallok");
    }

    public partial class MegallController
    {
        public override ActionResult PostBatch([FromBody] MegallBatch megallBatch) => CheckIfBadRequest(() => {
            Vonal? vonal = context
                .Vonalak
                .Where(vonal => vonal.Id == megallBatch.Vonal)
                .FirstOrDefault()
            ;
            if (vonal is not null)
            {
                vonal.KezdoAll = megallBatch.KezdoAll;
                vonal.Vegall = megallBatch.Megallok[^1].Allomas;
                context
                    .Megallok
                    .RemoveRange(context
                        .Megallok
                        .Where(megall => megall.Vonal == megallBatch.Vonal)
                    )
                ;
                context.Database.ExecuteSqlRaw(@"
                    DISABLE TRIGGER Vonal_Bovitve ON Megallok;
                    DISABLE TRIGGER Vonal_Roviditve ON Megallok;
                    DISABLE TRIGGER Megallo_Beszur ON Megallok;
                    DISABLE TRIGGER Megallo_Torol ON Megallok;
                ");
                ObjectResult result = TrySaveRange(megallBatch.ConvertType(), context.Megallok.AddRange);
                context.Database.ExecuteSqlRaw(@"
                    ENABLE TRIGGER Megallo_Torol ON Megallok;
                    ENABLE TRIGGER Megallo_Beszur ON Megallok;
                    ENABLE TRIGGER Vonal_Roviditve ON Megallok;
                    ENABLE TRIGGER Vonal_Bovitve ON Megallok;
                ");
                return result;
            }
            else
            {
                return NotFound($"A meghatározott vonal (id: {megallBatch.Vonal}) nem létezik!");
            }
        });

        public class MegallBatch : IConvertible<IReadOnlyList<Megall>>
        {
            [Required] public int Vonal { get; set; }
            [Required] public int KezdoAll { get; set; }

            [Required] public List<MegallBatchElem> Megallok { get; set; }

            public IReadOnlyList<Megall> ConvertType()
            {
                List<Megall> megallok = [new Megall {
                    Vonal = Vonal,
                    Allomas = Megallok[0].Allomas,
                    ElozoMegallo = KezdoAll,
                    HanyPerc = Megallok[0].HanyPerc
                }];
                for (int i = 1; i < Megallok.Count; i++)
                {
                    megallok.Add(new Megall {
                        Vonal = Vonal,
                        Allomas = Megallok[i].Allomas,
                        ElozoMegallo = Megallok[i - 1].Allomas,
                        HanyPerc = Megallok[i].HanyPerc
                    });
                }
                return megallok;
            }

            public class MegallBatchElem
            {
                [Required] public int Allomas { get; set; }
                [Required] public byte HanyPerc { get; set; }
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
                .ToList()
            ;
            int vonalakCount = vonalak.Count();
            return vonalakCount > 0
                ? ((Func<ActionResult>)(() => {
                    List<VonalMegallok> vonalMegallok = [];
                    try
                    {
                        vonalak.ToList().ForEach(vonal => {
                            vonalMegallok.Add(new VonalMegallok() {
                                Vonal = vonal.ConvertType(),
                                Megallok = ((Func<List<MegallDTO>>)(() => {
                                    IReadOnlyList<Megall> megallok = context
                                        .Megallok
                                        .Where(megall => megall.Vonal == vonal.Id)
                                        .ToList()
                                    ;
                                    if (megallok.Count > 0)
                                    {
                                        List<Megall> rendezettMegallok = [];
                                        rendezettMegallok.Add(megallok.SelectFirst(out Megall? elsoMegall, megall => megall.ElozoMegallo == vonal.KezdoAll) ? elsoMegall! : throw new InvalidOperationException());
                                        int legutobbiAllomasId = rendezettMegallok[0].Allomas;
                                        while (legutobbiAllomasId != vonal.Vegall)
                                        {
                                            rendezettMegallok.Add(megallok.SelectFirst(out Megall? ujMegall, megall => megall.ElozoMegallo == legutobbiAllomasId) ? ujMegall! : throw new InvalidOperationException());
                                            legutobbiAllomasId = rendezettMegallok[^1].Allomas;
                                        }
                                        return rendezettMegallok.ConvertAll(megall => megall.ConvertType());
                                    }
                                    else
                                    {
                                        return [];
                                    }
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
            public VonalDTO Vonal { get; set; }
            public List<MegallDTO> Megallok { get; set; }
        }
    }
}
