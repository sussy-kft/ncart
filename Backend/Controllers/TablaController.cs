using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    [ApiController]
    public abstract class TablaController<TDbFormat, TJsonFormat> : ControllerBase
        where TDbFormat : class, IConvertible<TJsonFormat>
        where TJsonFormat : class, IConvertible<TDbFormat>
    {
        protected AppDbContext context { get; }

        public TablaController(AppDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public abstract IEnumerable<TJsonFormat> Get();

        protected IEnumerable<TJsonFormat> Get(DbSet<TDbFormat> dbSet) => ConvertAllToDTO(dbSet.ToList());

        protected IActionResult Get(DbSet<TDbFormat> dbSet, params object?[]? pk) => CheckIfNotFound(dbSet, record => Ok(record.ConvertType()), pk);

        [HttpPost]
        public abstract IActionResult Post([FromBody] TJsonFormat data);

        protected IActionResult Post(DbSet<TDbFormat> dbSet, TJsonFormat data) => CheckIfBadRequest(() => {
            TDbFormat dbFormat = data.ConvertType();
            dbSet.Add(dbFormat);
            return TrySave(dbFormat);
        });

        protected IActionResult Put(DbSet<TDbFormat> dbSet, TJsonFormat data, Action<TDbFormat, TDbFormat> updateRecord, params object?[]? pk) => CheckIfBadRequest(() => CheckIfNotFound(
            dbSet: dbSet,
            handleRequest: record => {
                updateRecord(record, data.ConvertType());
                return TrySave(record);
            },
            pk: pk
        ));

        [HttpDelete]
        public abstract IActionResult Delete();

        protected IActionResult DeleteAll(DbSet<TDbFormat> dbSet)
        {
            List<TDbFormat> records = dbSet.ToList();
            dbSet.RemoveRange(records);
            return TrySaveData(() => ConvertAllToDTO(records));
        }

        protected IActionResult Delete(DbSet<TDbFormat> dbSet, params object?[]? pk) => CheckIfNotFound(
            dbSet: dbSet,
            handleRequest: record => {
                dbSet.Remove(record);
                return TrySave(record);
            },
            pk: pk
        );

        List<TJsonFormat> ConvertAllToDTO(List<TDbFormat> records) => records.ToList().ConvertAll(record => record.ConvertType());

        IActionResult TrySave(TDbFormat data) => TrySaveData(data.ConvertType);

        IActionResult TrySaveData<T>(Func<T> convert)
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

        IActionResult CheckIfNotFound(DbSet<TDbFormat> dbSet, Func<TDbFormat, IActionResult> handleRequest, params object?[]? pk)
        {
            TDbFormat? record = dbSet.Find(pk);
            return record != null ? handleRequest(record) : NotFound();
        }

        IActionResult CheckIfBadRequest(Func<IActionResult> handleRequest) => ModelState.IsValid ? handleRequest() : BadRequest(ModelState);
    }
}
