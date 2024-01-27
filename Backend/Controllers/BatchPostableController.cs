﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    public abstract class BatchPostableController<TPrimaryKey, TDbFormat, TJsonFormat, TBatchFormat> : TablaController<TPrimaryKey, TDbFormat, TJsonFormat>
        where TDbFormat : class, IConvertible<TJsonFormat>
        where TJsonFormat : class, IConvertible<TDbFormat>
        where TBatchFormat : class, IConvertible<IReadOnlyList<TDbFormat>>
    {
        protected BatchPostableController(AppDbContext context) : base(context)
        {

        }

        [HttpPost("batch")]
        public abstract ActionResult Post([FromBody] TBatchFormat data);

        protected ActionResult Post(DbSet<TDbFormat> dbSet, TBatchFormat data) => CheckIfBadRequest(() => TrySaveRange(data.ConvertType(), dbSet.AddRange));
    }
}
