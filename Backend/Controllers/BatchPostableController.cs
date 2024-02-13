﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    public abstract class BatchPostableController<TPrimaryKey, TDbFormat, TJsonFormat, TBatchFormat>(AppDbContext context) : TablaController<TPrimaryKey, TDbFormat, TJsonFormat>(context)
        where TDbFormat : class, IConvertible<TJsonFormat>
        where TJsonFormat : class, IConvertible<TDbFormat>
        where TBatchFormat : class, IConvertible<IReadOnlyList<TDbFormat>>
    {
        [HttpPost("batch")]
        public abstract ActionResult Post([FromBody] TBatchFormat data);

        protected ActionResult Post(DbSet<TDbFormat> dbSet, TBatchFormat data) => CheckIfBadRequest(() => TrySaveRange(data.ConvertType(), dbSet.AddRange));
    }
}
