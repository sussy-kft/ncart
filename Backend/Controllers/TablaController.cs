using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    public abstract class TablaController<TDbFormat, TJsonFormat> : JsonRecieverController
        where TDbFormat : class, IConvertible<TJsonFormat>
        where TJsonFormat : class, IConvertible<TDbFormat>
    {
        public TablaController(AppDbContext context) : base(context)
        {
            
        }

        [HttpGet]
        public abstract IEnumerable<TJsonFormat> Get();

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

        protected ActionResult Put(DbSet<TDbFormat> dbSet, TJsonFormat data, Action<TDbFormat, TDbFormat> updateRecord, params object?[]? pk) => CheckAll(
            dbSet: dbSet,
            handleRequest: record => TrySaveRecord(record, record =>
            {
                updateRecord(record, data.ConvertType());
            }),
            pk: pk
        );

        protected ActionResult Patch(DbSet<TDbFormat> dbSet, Action<TDbFormat> updateRecord, params object?[]? pk) => CheckAll(dbSet, record => TrySaveRecord(record, updateRecord), pk);

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

        protected ObjectResult TrySaveRange(IReadOnlyList<TDbFormat> records, Action<IReadOnlyList<TDbFormat>> action) => TrySave(records, action, () => TablaController<TDbFormat, TJsonFormat>.ConvertAllToDTO(records));

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

        public static IReadOnlyList<TJsonFormat> ConvertAllToDTO(IReadOnlyList<TDbFormat> records) => records.ToList().ConvertAll(record => record.ConvertType());

        ActionResult CheckAll(DbSet<TDbFormat> dbSet, Func<TDbFormat, ActionResult> handleRequest, params object?[]? pk) => CheckIfBadRequest(() => CheckIfNotFound(dbSet, handleRequest, pk));

        ActionResult CheckIfNotFound(DbSet<TDbFormat> dbSet, Func<TDbFormat, ActionResult> handleRequest, params object?[]? pk)
        {
            TDbFormat? record = dbSet.Find(pk);
            return record != null ? handleRequest(record) : NotFound();
        }

        protected ActionResult CheckIfBadRequest(Func<ActionResult> handleRequest) => ModelState.IsValid ? handleRequest() : BadRequest(ModelState);

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
