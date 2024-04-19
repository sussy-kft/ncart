using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("vonalak"), Authorize(Policy = nameof(KezeloController.Engedelyek.JaratokSzerkesztese))]
    public partial class VonalController(AppDbContext context, IConfiguration config) : TablaController<int, Vonal, VonalDTO>(context, config)
    {
        protected override string tableName => nameof(AppDbContext.Vonalak);

        protected override DbSet<Vonal> dbSet => context.Vonalak;

        [HttpGet("{id}")]
        public override ActionResult Get([FromRoute] int id) => PerformGet(id);

        public override ActionResult Post([FromBody] VonalDTO data)
        {
            ActionResult result = PerformPost(data);
            return result is OkObjectResult ? GetOdaVissza(data.VonalSzam, data.JarmuTipus) : result;
        }

        [HttpDelete("{id}")]
        public override ActionResult Delete([FromRoute] int id) => PerformDelete(id);
    }

    public partial class VonalController : IPatchableIdentityPkTablaController<VonalController.VonalPatch>
    {
        [HttpPatch("{id}")]
        public ActionResult Patch([FromRoute] int id, [FromBody] VonalPatch ujVonal) => PerformPatch(
            updateRecord: record => {
                CheckIfNotNull(ujVonal.VonalSzam, vonalSzam => {
                    record.VonalSzam = vonalSzam;
                });
                CheckIfNotNull(ujVonal.JarmuTipus, jarmuTipus => {
                    record.JarmuTipus = jarmuTipus;
                });
                CheckIfNotNull(ujVonal.KezdoAll, kezdoAll => {
                    record.KezdoAll = kezdoAll;
                });
                CheckIfNotNull(ujVonal.Vegall, vegall => {
                    record.Vegall = vegall;
                });
            },
            pk: id
        );

        public class VonalPatch
        {
            [MaxLength(4)] public string? VonalSzam { get; set; }
            public int? JarmuTipus { get; set; }
            public int? KezdoAll { get; set; }
            public int? Vegall { get; set; }
        }
    }

    public partial class VonalController
    {
        [HttpGet("megallok/{vonalSzam}/{jarmuTipus}"), AllowAnonymous]
        public ActionResult GetOdaVissza(string vonalSzam, int jarmuTipus)
        {
            IReadOnlyList<Vonal> vonalak = dbSet.Where(vonal => vonal.VonalSzam == vonalSzam && vonal.JarmuTipus == jarmuTipus).ToList();
            int vonalakCount = vonalak.Count();
            return vonalakCount > 0
                ? ((Func<ActionResult>)(() => {
                    List<VonalMegallok> vonalMegallok = [];
                    try
                    {
                        vonalak.ToList().ForEach(vonal => {
                            vonalMegallok.Add(new VonalMegallok()
                            {
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
                        return StatusCode(500);
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

    public partial class VonalController
    {
        [HttpGet("megallok/{vonalSzam}/{jarmuTipus}/fixed"), AllowAnonymous]
        public ActionResult GetOdaVisszaFixed(string vonalSzam, int jarmuTipus) => HandleError(() => {
            IReadOnlyList<Vonal> vonalak = dbSet.Where(vonal => vonal.VonalSzam == vonalSzam && vonal.JarmuTipus == jarmuTipus).ToList();
            int vonalakCount = vonalak.Count();
            if (vonalakCount > 0)
            {
                List<VonalMegallokFixed> vonalMegallok = [];
                vonalak.ToList().ForEach(vonal => {
                    vonalMegallok.Add(new VonalMegallokFixed {
                        Vonal = new VonalMegallokVonalDTO {
                            Id = vonal.Id,
                            VonalSzam = vonal.VonalSzam,
                            JarmuTipus = vonal.JarmuTipus,
                            KezdoAll = context
                                .Allomasok
                                .Where(allomas => allomas.Id == vonal.KezdoAll)
                                .First()
                                .ConvertType()
                        },
                        Megallok = ((Func<List<AllomasEsIdo>>)(() => {
                            IReadOnlyList<AllomasJoinMegall> allomasokJoinMegallok = context
                                .Allomasok
                                .Join(context.Megallok, allomas => allomas.Id, megall => megall.Allomas, (allomas, megall) => new AllomasJoinMegall {
                                    Allomas = allomas,
                                    Megall = megall
                                })
                                .Where(allomasJoinMegall => allomasJoinMegall.Megall.Vonal == vonal.Id)
                                .ToList()
                            ;
                            if (allomasokJoinMegallok.Count > 0)
                            {
                                List<AllomasJoinMegall> rendezettMegallok = [];
                                rendezettMegallok.Add(allomasokJoinMegallok.SelectFirst(out AllomasJoinMegall? elsoAllomasJoinMegall, allomasJoinMegall => allomasJoinMegall.Megall.ElozoMegallo == vonal.KezdoAll) ? elsoAllomasJoinMegall! : throw new Exception("A meghatározott vonalhoz tartozó egyetlen \"Megall\" rekord \"ElozoMegallo\" mezője se egyezik meg az adott \"Vonal\" rekord \"KezdoAll\" mezőjével."));
                                int legutobbiAllomasId = rendezettMegallok[0].Allomas.Id;
                                while (legutobbiAllomasId != vonal.Vegall)
                                {
                                    rendezettMegallok.Add(allomasokJoinMegallok.SelectFirst(out AllomasJoinMegall? ujAllomasJoinMegall, allomasJoinMegall => allomasJoinMegall.Megall.ElozoMegallo == legutobbiAllomasId) ? ujAllomasJoinMegall! : throw new Exception("A meghatározott vonalhoz tartozó \"Megall\" rekordok között van egy hiányzó megálló, vagy az utolsó megálló \"Allomas\" mezőjének értéke nem egyezik meg az adott \"Vonal\" rekord \"Vegall\" mezőjének értékével."));
                                    legutobbiAllomasId = rendezettMegallok[^1].Allomas.Id;
                                }
                                return rendezettMegallok.ConvertAll(allomasJoinMegall => new AllomasEsIdo {
                                    Allomas = allomasJoinMegall.Allomas.ConvertType(),
                                    HanyPerc = allomasJoinMegall.Megall.HanyPerc
                                });
                            }
                            else
                            {
                                return [];
                            }
                        }))()
                    });
                });
                return Ok(vonalakCount == 1
                    ? new OdaVisszaFixed {
                        Oda = vonalMegallok[0]
                    }
                    : new OdaVisszaFixed {
                        Oda = vonalMegallok[0],
                        Vissza = vonalMegallok[1]
                    }
                );
            }
            else
            {
                return NotFound();
            }
        });

        class OdaVisszaFixed
        {
            public VonalMegallokFixed Oda { get; set; }
            public VonalMegallokFixed? Vissza { get; set; }
        }

        class VonalMegallokFixed
        {
            public VonalMegallokVonalDTO Vonal { get; set; }
            public List<AllomasEsIdo> Megallok { get; set; }
        }

        class VonalMegallokVonalDTO
        {
            public int Id { get; set; }
            public string VonalSzam { get; set; }
            public int JarmuTipus { get; set; }
            public AllomasDTO KezdoAll { get; set; }
        }

        class AllomasJoinMegall
        {
            public Allomas Allomas { get; set; }
            public Megall Megall { get; set; }
        }

        class AllomasEsIdo
        {
            public AllomasDTO Allomas { get; set; }
            public int HanyPerc { get; set; }
        }
    }

    public partial class VonalController
    {
        [HttpGet("jaratok"), AllowAnonymous]
        public IEnumerable<Jarat> GetVonalSzamok() => dbSet
            .Select(vonal => new Jarat {
                VonalSzam = vonal.VonalSzam,
                JarmuTipus = vonal.JarmuTipus
            })
            .Distinct()
        ;

        public class Jarat
        {
            public string VonalSzam { get; set; }
            public int JarmuTipus { get; set; }
        }
    }
}
