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

        protected IActionResult Get(DbSet<TDbFormat> dbSet, params object?[]? pk) => CheckIfNotFound(dbSet, Ok, pk);

        [HttpPost]
        public abstract IActionResult Post([FromBody] TJsonFormat data);

        protected IActionResult Post(Func<OkObjectResult> postData) => CheckIfBadRequest(postData);

        protected IActionResult Put(DbSet<TDbFormat> dbSet, Func<TDbFormat, OkObjectResult> updateData, params object?[]? pk) => CheckIfBadRequest(() => CheckIfNotFound(dbSet, updateData, pk));

        protected IActionResult Delete (DbSet<TDbFormat> dbSet, params object?[]? pk) => CheckIfNotFound(
            dbSet: dbSet,
            handleRequest: record => HandleDbUpdateException(() => {
                dbSet.Remove(record);
                context.SaveChanges();
                return Ok(record);
            }),
            pk: pk
        );

        IActionResult CheckIfNotFound(DbSet<TDbFormat> dbSet, Func<TDbFormat, IActionResult> handleRequest, params object?[]? pk)
        {
            TDbFormat? record = dbSet.Find(pk);
            return record != null ? handleRequest(record) : NotFound();
        }

        IActionResult CheckIfBadRequest(Func<IActionResult> handleRequest)
        {
            if (ModelState.IsValid)
            {
                return HandleDbUpdateException(handleRequest);
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

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
