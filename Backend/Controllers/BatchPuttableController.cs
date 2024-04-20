using Microsoft.AspNetCore.Mvc;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    public abstract class BatchPuttableController<TPrimaryKey, TDbFormat, TJsonFormat, TBatchFormat>(AppDbContext context) : TableController<TPrimaryKey, TDbFormat, TJsonFormat>(context)
        where TDbFormat : class, IConvertible<TJsonFormat>
        where TJsonFormat : class, IConvertible<TDbFormat>
        where TBatchFormat : class, IConvertible<IEnumerable<TDbFormat>>
    {
        [HttpPut("batch")]
        public abstract ActionResult PutBatch([FromBody] TBatchFormat data);

        protected ActionResult PerformPutBatch(TBatchFormat data, Func<TDbFormat, object?[]?> extractPk) => CheckIfBadRequest(() => {
            IEnumerable<TDbFormat> dbFormats = data.ConvertType();
            dbFormats.ToList().ForEach(dbFormat => {
                TDbFormat? record = dbSet.Find(extractPk(dbFormat));
                if (record is not null)
                {
                    dbSet.Remove(record);
                }
            });
            return TrySaveRange(dbFormats, dbSet.AddRange);
        });
    }
}
