using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("vonalak"), Authorize(Policy = KezeloController.JaratokSzerkesztese)]
    public partial class VonalController(AppDbContext context, IConfiguration config) : TablaController<int, Vonal, VonalDTO>(context, config)
    {
        public override IEnumerable<VonalDTO> Get() => GetAll(context.Vonalak);

        [HttpGet("{id}")]
        public override ActionResult Get([FromRoute] int id) => Get(context.Vonalak, id);

        public override ActionResult Post([FromBody] VonalDTO data)
        {
            ActionResult result = Post(context.Vonalak, data);
            return result is OkObjectResult ? GetOdaVissza(data.VonalSzam, data.JarmuTipus) : result;
        }

        [HttpPut("{id}")]
        public override ActionResult Put([FromRoute] int id, [FromBody] VonalDTO ujVonal) => Put(
            dbSet: context.Vonalak,
            data: ujVonal,
            updateRecord: (vonal, ujVonal) => {
                vonal.VonalSzam = ujVonal.VonalSzam;
                vonal.JarmuTipus = ujVonal.JarmuTipus;
                vonal.KezdoAll = ujVonal.KezdoAll;
                vonal.Vegall = ujVonal.Vegall;
            },
            pk: id
        );

        public override ActionResult Delete() => DeleteAll(context.Vonalak);

        [HttpDelete("{id}")]
        public override ActionResult Delete([FromRoute] int id) => Delete(context.Vonalak, id);

        public override IEnumerable<IMetadataDTO<object>> Metadata() => Metadata("Vonalak");
    }

    public partial class VonalController : IPatchableIdentityPkTablaController<VonalController.VonalPatch>
    {
        [HttpPatch("{id}")]
        public ActionResult Patch([FromRoute] int id, [FromBody] VonalPatch ujVonal) => Patch(
            dbSet: context.Vonalak,
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

    public partial class VonalController
    {
        [HttpGet("megallok/{vonalSzam}/{jarmuTipus}/fixed"), AllowAnonymous]
        public ActionResult GetOdaVisszaFixed(string vonalSzam, int jarmuTipus) => HandleError<ActionResult>(() => {
            IReadOnlyList<Vonal> vonalak = context
                .Vonalak
                .Where(vonal => vonal.VonalSzam == vonalSzam && vonal.JarmuTipus == jarmuTipus)
                .ToList()
            ;
            int vonalakCount = vonalak.Count();
            if (vonalakCount > 0)
            {
                List<VonalMegallokFixed> vonalMegallok = [];
                vonalak.ToList().ForEach(vonal => {
                    vonalMegallok.Add(new VonalMegallokFixed {
                        Vonal = vonal.ConvertType(),
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
                    return Ok(vonalakCount == 1
                        ? new OdaVissza()
                        {
                            Oda = vonalMegallok[0]
                        }
                        : new OdaVissza()
                        {
                            Oda = vonalMegallok[0],
                            Vissza = vonalMegallok[1]
                        }
                    );
                }))()
                : NotFound()
            ;
        }

        class OdaVisszaFixed
        {
            public VonalMegallokFixed Oda { get; set; }
            public VonalMegallokFixed? Vissza { get; set; }
        }

        class VonalMegallokFixed
        {
            public VonalDTO Vonal { get; set; }
            public List<MegallDTO> Megallok { get; set; }
        }
    }

    public partial class VonalController
    {
        [HttpGet("jaratok"), AllowAnonymous]
        public IEnumerable<Jarat> GetVonalSzamok() => context
            .Vonalak
            .Select(vonal => new Jarat
            {
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
