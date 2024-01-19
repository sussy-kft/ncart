using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    public abstract class TablaController<TDbFormat, TJsonFormat> : ControllerBase where TDbFormat : class where TJsonFormat : class
    {
        protected AppDbContext context { get; }

        public TablaController(AppDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public abstract IEnumerable<TJsonFormat> Get();

        protected IActionResult Get(DbSet<TDbFormat> dbSet, Func<TDbFormat, TJsonFormat> convertToJsonFormat, params object?[]? pk) => CheckIfNotFound(dbSet, record => Ok(convertToJsonFormat(record)), pk);

        [HttpPost]
        public abstract IActionResult Post([FromBody] TJsonFormat data);

        protected IActionResult Post(DbSet<TDbFormat> dbSet, TDbFormat data, Func<TDbFormat, TJsonFormat> convertToJsonFormat) => CheckIfBadRequest(() => {
            dbSet.Add(data);
            return TrySave(convertToJsonFormat(data));
        });

        protected IActionResult Put(DbSet<TDbFormat> dbSet, Func<TDbFormat, TJsonFormat> updateRecord, params object?[]? pk) => CheckIfBadRequest(() => CheckIfNotFound(dbSet, record => TrySave(updateRecord(record)), pk));

        protected IActionResult Delete(DbSet<TDbFormat> dbSet, Func<TDbFormat, TJsonFormat> convertToJsonFormat, params object?[]? pk) => CheckIfNotFound(
            dbSet: dbSet,
            handleRequest: record => {
                dbSet.Remove(record);
                return TrySave(convertToJsonFormat(record));
            },
            pk: pk
        );

        protected IActionResult TrySave(TJsonFormat record)
        {
            try
            {
                context.SaveChanges();
                return Ok(record);
            }
            catch (DbUpdateConcurrencyException e)
            {
                return Conflict(e.Message);
            }
            catch (DbUpdateException e)
            {
                return BadRequest(e.Message);
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
