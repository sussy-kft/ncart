using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs;
using Backend.Models;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    [Route("megallok"), Authorize(Policy = nameof(KezeloController.Engedelyek.JaratokSzerkesztese))]
    public partial class MegallController(AppDbContext context) : BatchPuttableController<MegallController.PK, Megall, MegallDTO, MegallController.MegallBatch>(context)
    {
        protected override string tableName => nameof(AppDbContext.Megallok);

        protected override DbSet<Megall> dbSet => context.Megallok;

        public class PK
        {
            public int vonal { get; set; }
            public int allomas { get; set; }
        }

        [HttpGet("{vonal}/{allomas}")]
        public override ActionResult Get([FromRoute] PK pk) => PerformGet(pk.vonal, pk.allomas);

        public override ActionResult Post([FromBody] MegallDTO data) => PerformPost(data);

        public override ActionResult Put([FromBody] MegallDTO data)
        {
            Megall megall = data.ConvertType();
            return PerformPut(megall, megall.Vonal, megall.Allomas);
        }

        [HttpDelete("{vonal}/{allomas}")]
        public override ActionResult Delete([FromRoute] PK pk) => PerformDelete(pk.vonal, pk.allomas);
    }

    public partial class MegallController
    {
        public override ActionResult PutBatch([FromBody] MegallBatch megallBatch) => CheckIfBadRequest(() => {
            Vonal? vonal = context
                .Vonalak
                .Where(vonal => vonal.Id == megallBatch.Vonal)
                .FirstOrDefault()
            ;
            if (vonal is not null)
            {
                vonal.KezdoAll = megallBatch.KezdoAll;
                vonal.Vegall = megallBatch.Megallok[^1].Allomas;
                dbSet.RemoveRange(dbSet.Where(megall => megall.Vonal == megallBatch.Vonal));
                context.Database.ExecuteSqlRaw(@"
                    DISABLE TRIGGER Vonal_Bovitve ON Megallok;
                    DISABLE TRIGGER Vonal_Roviditve ON Megallok;
                    DISABLE TRIGGER Megallo_Beszur ON Megallok;
                    DISABLE TRIGGER Megallo_Torol ON Megallok;
                    ALTER TABLE Megallok NOCHECK CONSTRAINT CK_Megallok_LetezoMegallo
                ");
                ObjectResult result = TrySaveRange(megallBatch.ConvertType(), dbSet.AddRange);
                context.Database.ExecuteSqlRaw(@"
                    ALTER TABLE Megallok CHECK CONSTRAINT CK_Megallok_LetezoMegallo
                    ;ENABLE TRIGGER Megallo_Torol ON Megallok
                    ;ENABLE TRIGGER Megallo_Beszur ON Megallok
                    ;ENABLE TRIGGER Vonal_Roviditve ON Megallok
                    ;ENABLE TRIGGER Vonal_Bovitve ON Megallok
                ");
                return result;
            }
            else
            {
                return NotFound($"A meghatározott vonal (id: {megallBatch.Vonal}) nem létezik!");
            }
        });

        public class MegallBatch : IConvertible<IEnumerable<Megall>>
        {
            [Required] public int Vonal { get; set; }
            [Required] public int KezdoAll { get; set; }

            [Required] public List<MegallBatchElem> Megallok { get; set; }

            public IEnumerable<Megall> ConvertType()
            {
                List<Megall> megallok = [];
                if (Megallok.Count > 0)
                {
                    megallok.Add(new Megall {
                        Vonal = Vonal,
                        Allomas = Megallok[0].Allomas,
                        ElozoMegallo = KezdoAll,
                        HanyPerc = Megallok[0].HanyPerc
                    });
                    for (int i = 1; i < Megallok.Count; i++)
                    {
                        megallok.Add(new Megall {
                            Vonal = Vonal,
                            Allomas = Megallok[i].Allomas,
                            ElozoMegallo = Megallok[i - 1].Allomas,
                            HanyPerc = Megallok[i].HanyPerc
                        });
                    }
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

    public partial class MegallController : IPatchableTableController<MegallController.PK, MegallController.MegallPatch>
    {
        [HttpPatch("{vonal}/{allomas}")]
        public ActionResult Patch([FromRoute] PK pk, [FromBody] MegallPatch ujMegall) => PerformPatch(
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
}
