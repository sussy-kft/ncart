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
            return SaveAndOk(convertToJsonFormat(data));
        });

        protected IActionResult Put(DbSet<TDbFormat> dbSet, Func<TDbFormat, TJsonFormat> updateRecord, params object?[]? pk) => CheckIfBadRequest(() => CheckIfNotFound(dbSet, record => SaveAndOk(updateRecord(record)), pk));

        protected IActionResult Delete(DbSet<TDbFormat> dbSet, Func<TDbFormat, TJsonFormat> convertToJsonFormat, params object?[]? pk) => CheckIfNotFound(
            dbSet: dbSet,
            handleRequest: record => HandleDbUpdateException(() => {
                dbSet.Remove(record);
                return SaveAndOk(convertToJsonFormat(record));
            }),
            pk: pk
        );

        protected OkObjectResult SaveAndOk(TJsonFormat record)
        {
            context.SaveChanges();
            return Ok(record);
        }

        IActionResult CheckIfNotFound(DbSet<TDbFormat> dbSet, Func<TDbFormat, IActionResult> handleRequest, params object?[]? pk)
        {
            TDbFormat? record = dbSet.Find(pk);
            return record != null ? handleRequest(record) : NotFound();
        }

        IActionResult CheckIfBadRequest(Func<IActionResult> handleRequest) => ModelState.IsValid ? HandleDbUpdateException(handleRequest) : BadRequest(ModelState);

        IActionResult HandleDbUpdateException(Func<IActionResult> handleRequest)
        {
            try
            {
                return handleRequest();
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
    }
}
