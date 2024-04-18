using Microsoft.AspNetCore.Mvc;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    public abstract class BatchPuttableController<TPrimaryKey, TDbFormat, TJsonFormat, TBatchFormat>(AppDbContext context, IConfiguration config) : TablaController<TPrimaryKey, TDbFormat, TJsonFormat>(context, config)
        where TDbFormat : class, IConvertible<TJsonFormat>
        where TJsonFormat : class, IConvertible<TDbFormat>
        where TBatchFormat : class, IConvertible<IEnumerable<TDbFormat>>
    {
        [HttpPut("batch")]
        public abstract ActionResult PutBatch([FromBody] TBatchFormat data);

        protected ActionResult PerformPutBatch(TBatchFormat data) => CheckIfBadRequest(() => TrySaveRange(data.ConvertType(), dbSet.AddRange));
    }
}
