﻿using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("jarmutipusok")]
    public partial class JarmuTipusController(AppDbContext context) : TablaController<int, JarmuTipus, JarmuTipusDTO>(context)
    {
        public override IEnumerable<JarmuTipusDTO> Get() => GetAll(context.JarmuTipusok);

        public override ActionResult Post([FromBody] JarmuTipusDTO data) => Post(context.JarmuTipusok, data);

        public override ActionResult Delete() => DeleteAll(context.JarmuTipusok);

        [HttpDelete("{id}")]
        public override ActionResult Delete([FromRoute] int id) => Delete(context.JarmuTipusok, id);
    }

    public partial class JarmuTipusController
    {
        [HttpGet("{id}")]
        public override ActionResult Get([FromRoute] int id) => Get(context.JarmuTipusok, id);
    }

    public partial class JarmuTipusController
    {
        [HttpPut("{id}")]
        public override ActionResult Put([FromRoute] int id, [FromBody] JarmuTipusDTO ujJarmuTipus) => Put(
            dbSet: context.JarmuTipusok,
            data: ujJarmuTipus,
            updateRecord: (jarmuTipus, ujJarmuTipus) => {
                jarmuTipus.Megnevezes = ujJarmuTipus.Megnevezes;
            },
            pk: id
        );
    }
}
