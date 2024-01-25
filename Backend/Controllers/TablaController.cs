using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    public abstract class TablaController<TDbFormat, TJsonFormat> : ControllerContext
        where TDbFormat : class, IConvertible<TJsonFormat>
        where TJsonFormat : class, IConvertible<TDbFormat>
    {
        public TablaController(AppDbContext context) : base(context)
        {
            
        }

        [HttpGet]
        public abstract IEnumerable<TJsonFormat> Get();

        protected ActionResult Get(DbSet<TDbFormat> dbSet, params object?[]? pk) => CheckIfNotFound(dbSet, record => Ok(record.ConvertType()), pk);

        protected static IEnumerable<TJsonFormat> GetAll(DbSet<TDbFormat> dbSet) => ConvertAllToDTO(dbSet.ToList());

        [HttpPost]
        public abstract ActionResult Post([FromBody] TJsonFormat data);

        protected ActionResult Post(DbSet<TDbFormat> dbSet, TJsonFormat data) => CheckIfBadRequest(() => {
            TDbFormat dbFormat = data.ConvertType();
            return ModifyRecord(dbFormat, record => dbSet.Add(dbFormat));
        });

        protected ActionResult Put(DbSet<TDbFormat> dbSet, TJsonFormat data, Action<TDbFormat, TDbFormat> updateRecord, params object?[]? pk) => CheckIfBadRequest(() => CheckIfNotFound(
            dbSet: dbSet,
            handleRequest: record => ModifyRecord(record, record => {
                updateRecord(record, data.ConvertType());
            }),
            pk: pk
        ));

        protected ActionResult Patch(DbSet<TDbFormat> dbSet, Action<TDbFormat> updateRecord, params object?[]? pk) => CheckIfBadRequest(() => CheckIfNotFound(
            dbSet: dbSet,
            handleRequest: record => ModifyRecord(record, updateRecord),
            pk: pk
        ));

        [HttpDelete]
        public abstract ActionResult Delete();

        protected ActionResult Delete(DbSet<TDbFormat> dbSet, params object?[]? pk) => CheckIfNotFound(
            dbSet: dbSet,
            handleRequest: record => ModifyRecord(record, record => {
                dbSet.Remove(record);
            }),
            pk: pk
        );

        protected ObjectResult DeleteAll(DbSet<TDbFormat> dbSet) => ModifyRange(dbSet.ToList(), dbSet.RemoveRange);

        ObjectResult ModifyRecord(TDbFormat record, Action<TDbFormat> action) => TrySave(record, action, record.ConvertType);

        protected ObjectResult ModifyRange(IReadOnlyList<TDbFormat> records, Action<IReadOnlyList<TDbFormat>> action) => TrySave(records, action, () => ConvertAllToDTO(records));

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

        protected ActionResult CheckIfNotFound(DbSet<TDbFormat> dbSet, Func<TDbFormat, ActionResult> handleRequest, params object?[]? pk)
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

        static IReadOnlyList<TJsonFormat> ConvertAllToDTO(IReadOnlyList<TDbFormat> records) => records.ToList().ConvertAll(record => record.ConvertType());
    }
}
