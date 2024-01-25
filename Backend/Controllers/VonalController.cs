﻿using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("vonalak")]
    public partial class VonalController : TablaController<Vonal, VonalDTO>
    {
        public VonalController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<VonalDTO> Get() => GetAll(context.Vonalak);

        [HttpGet("{id}")]
        public ActionResult Get(int id) => this.Get(context.Vonalak, id);

        public override ActionResult Post([FromBody] VonalDTO data) => Post(context.Vonalak, data);

        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] VonalDTO ujVonal) => this.Put(
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
        public ActionResult Delete(int id) => Delete(context.Vonalak, id);
    }

    public partial class VonalController
    {
        [HttpPatch("{id}")]
        public ActionResult Patch(int id, [FromBody] VonalPatch ujVonal) => this.Patch(
            dbSet: context.Vonalak,
            updateRecord: record => {
                TablaControllerMetodusok.CheckIfNotNull(ujVonal.VonalSzam, vonalSzam => {
                    record.VonalSzam = vonalSzam;
                });
                TablaControllerMetodusok.CheckIfNotNull(ujVonal.JarmuTipus, jarmuTipus => {
                    record.JarmuTipus = jarmuTipus;
                });
                TablaControllerMetodusok.CheckIfNotNull(ujVonal.KezdoAll, kezdoAll => {
                    record.KezdoAll = kezdoAll;
                });
                TablaControllerMetodusok.CheckIfNotNull(ujVonal.Vegall, vegall => {
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
        [HttpGet("vonalszamok")]
        public IEnumerable<string> GetVonalSzamok() => context.Vonalak.Select(vonal => vonal.VonalSzam).Distinct();
    }
}
