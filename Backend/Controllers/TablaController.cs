using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    public abstract class TablaController<TPrimaryKey, TDbFormat, TJsonFormat> : JsonRecieverController
        where TDbFormat : class, IConvertible<TJsonFormat>
        where TJsonFormat : class, IConvertible<TDbFormat>
    {
        protected TablaController(AppDbContext context) : base(context)
        {
            
        }

        [HttpGet]
        public abstract IEnumerable<TJsonFormat> Get();

        public virtual ActionResult Get([FromRoute] TPrimaryKey pk) => throw new NotSupportedException("How the fuck did you manage to get this error?");

        protected IEnumerable<TJsonFormat> GetAll(DbSet<TDbFormat> dbSet) => ConvertAllToDTO(dbSet.ToList());

        protected ActionResult Get(DbSet<TDbFormat> dbSet, params object?[]? pk) => CheckIfNotFound(dbSet, record => Ok(record.ConvertType()), pk);

        [HttpPost]
        public abstract ActionResult Post([FromBody] TJsonFormat data);

        protected ActionResult Post(DbSet<TDbFormat> dbSet, TJsonFormat data) => CheckIfBadRequest(() => {
            TDbFormat dbFormat = data.ConvertType();
            return TrySaveRecord(dbFormat, record => {
                dbSet.Add(dbFormat);
            });
        });

        public virtual ActionResult Put([FromRoute] TPrimaryKey pk, [FromBody] TJsonFormat data) => StatusCode(405);

        protected ActionResult Put(DbSet<TDbFormat> dbSet, TJsonFormat data, Action<TDbFormat, TDbFormat> updateRecord, params object?[]? pk) => CheckAll(
            dbSet: dbSet,
            handleRequest: record => TrySaveRecord(record, record => {
                updateRecord(record, data.ConvertType());
            }),
            pk: pk
        );

        protected ActionResult Patch(DbSet<TDbFormat> dbSet, Action<TDbFormat> updateRecord, params object?[]? pk) => CheckAll(dbSet, record => TrySaveRecord(record, updateRecord), pk);

        public abstract ActionResult Delete([FromRoute] TPrimaryKey pk);

        [HttpDelete]
        public abstract ActionResult Delete();

        protected ActionResult Delete(DbSet<TDbFormat> dbSet, params object?[]? pk) => CheckIfNotFound(
            dbSet: dbSet,
            handleRequest: record => TrySaveRecord(record, record => {
                dbSet.Remove(record);
            }),
            pk: pk
        );

        protected ObjectResult DeleteAll(DbSet<TDbFormat> dbSet) => TrySaveRange(dbSet.ToList(), dbSet.RemoveRange);

        ObjectResult TrySaveRecord(TDbFormat record, Action<TDbFormat> action) => TrySave(record, action, record.ConvertType);

        protected ObjectResult TrySaveRange(IReadOnlyList<TDbFormat> records, Action<IReadOnlyList<TDbFormat>> action) => TrySave(records, action, () => ConvertAllToDTO(records));

        ObjectResult TrySave<TRecord, TJson>(TRecord record, Action<TRecord> action, Func<TJson> convert)
            where TRecord : class
            where TJson : class
        {
            action(record);
            try
            {
                context.SaveChanges();
                return Ok(convert());
            }
            catch (DbUpdateConcurrencyException e)
            {
                return Conflict(e.InnerException?.Message);
            }
            catch (DbUpdateException e)
            {
                return BadRequest(e.InnerException?.Message);
            }
        }

        static IReadOnlyList<TJsonFormat> ConvertAllToDTO(IReadOnlyList<TDbFormat> records) => records.ToList().ConvertAll(record => record.ConvertType());

        ActionResult CheckAll(DbSet<TDbFormat> dbSet, Func<TDbFormat, ActionResult> handleRequest, params object?[]? pk) => CheckIfBadRequest(() => CheckIfNotFound(dbSet, handleRequest, pk));

        ActionResult CheckIfNotFound(DbSet<TDbFormat> dbSet, Func<TDbFormat, ActionResult> handleRequest, params object?[]? pk)
        {
            TDbFormat? record = dbSet.Find(pk);
            return record != null ? handleRequest(record) : NotFound();
        }

        protected static void CheckIfNotNull<T>(T? value, Action<T> action) where T : class
        {
            if (value != null)
            {
                action(value);
            }
        }

        protected static void CheckIfNotNull<T>(T? value, Action<T> action) where T : struct
        {
            if (value != null)
            {
                action((T)value);
            }
        }
    }
}
