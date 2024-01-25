using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    public abstract class TablaController<TDbFormat, TJsonFormat> : JsonRecieverController
        where TDbFormat : class, IConvertible<TJsonFormat>
        where TJsonFormat : class, IConvertible<TDbFormat>
    {
        public AppDbContext Context
        {
            get => context;
        }

        public TablaController(AppDbContext context) : base(context)
        {
            
        }

        [HttpGet]
        public abstract IEnumerable<TJsonFormat> Get();

        protected IEnumerable<TJsonFormat> GetAll(DbSet<TDbFormat> dbSet) => TablaControllerMetodusok.ConvertAllToDTO<TDbFormat, TJsonFormat>(dbSet.ToList());

        [HttpPost]
        public abstract ActionResult Post([FromBody] TJsonFormat data);

        protected ActionResult Post(DbSet<TDbFormat> dbSet, TJsonFormat data) => this.CheckIfBadRequest(() => {
            TDbFormat dbFormat = data.ConvertType();
            return this.TrySaveRecord(dbFormat, record => {
                dbSet.Add(dbFormat);
            });
        });

        [HttpDelete]
        public abstract ActionResult Delete();

        protected ActionResult Delete(DbSet<TDbFormat> dbSet, params object?[]? pk) => this.CheckIfNotFound(
            dbSet: dbSet,
            handleRequest: record => this.TrySaveRecord(record, record => {
                dbSet.Remove(record);
            }),
            pk: pk
        );

        protected ObjectResult DeleteAll(DbSet<TDbFormat> dbSet) => this.TrySaveRange(dbSet.ToList(), dbSet.RemoveRange);
    }
}
