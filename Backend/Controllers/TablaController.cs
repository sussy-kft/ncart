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

        protected IEnumerable<TJsonFormat> GetAll(DbSet<TDbFormat> dbSet) => ConvertAllToDTO(dbSet.ToList());

        [HttpPost]
        public abstract ActionResult Post([FromBody] TJsonFormat data);

        protected ActionResult Post(DbSet<TDbFormat> dbSet, TJsonFormat data) => CheckIfBadRequest(() => {
            TDbFormat dbFormat = data.ConvertType();
            dbSet.Add(dbFormat);
            return TrySave(dbFormat);
        });

        [HttpDelete]
        public abstract ActionResult Delete();

        protected ActionResult Delete(DbSet<TDbFormat> dbSet, params object?[]? pk) => CheckIfNotFound(
            dbSet: dbSet,
            handleRequest: record => {
                dbSet.Remove(record);
                return TrySave(record);
            },
            pk: pk
        );

        protected ObjectResult DeleteAll(DbSet<TDbFormat> dbSet) => ModifyRange(dbSet.ToList(), dbSet.RemoveRange);

        protected ObjectResult ModifyRange(IReadOnlyList<TDbFormat> records, Action<IReadOnlyList<TDbFormat>> action)
        {
            action(records);
            return TrySave(() => ConvertAllToDTO(records));
        }

        protected IReadOnlyList<TJsonFormat> ConvertAllToDTO(IReadOnlyList<TDbFormat> records) => records.ToList().ConvertAll(record => record.ConvertType());

        protected ObjectResult TrySave<T>(Func<T> convert)
        {
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

        protected ObjectResult TrySave(TDbFormat data) => TrySave(data.ConvertType);

        protected ActionResult CheckIfNotFound(DbSet<TDbFormat> dbSet, Func<TDbFormat, ActionResult> handleRequest, params object?[]? pk)
        {
            TDbFormat? record = dbSet.Find(pk);
            return record != null ? handleRequest(record) : NotFound();
        }
    }
}
