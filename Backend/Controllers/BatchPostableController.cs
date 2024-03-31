using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    public abstract class BatchPostableController<TPrimaryKey, TDbFormat, TJsonFormat, TBatchFormat>(AppDbContext context, IConfiguration config) : TablaController<TPrimaryKey, TDbFormat, TJsonFormat>(context, config)
        where TDbFormat : class, IConvertible<TJsonFormat>
        where TJsonFormat : class, IConvertible<TDbFormat>
        where TBatchFormat : class, IConvertible<IReadOnlyList<TDbFormat>>
    {
        [HttpPost("batch")]
        public abstract ActionResult PostBatch([FromBody] TBatchFormat data);

        protected ActionResult PostBatch(DbSet<TDbFormat> dbSet, TBatchFormat data) => CheckIfBadRequest(() => TrySaveRange(data.ConvertType(), dbSet.AddRange));
    }
}
