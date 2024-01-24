using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    public abstract class ModosithatoTablaController<TDbFormat, TJsonFormat> : TablaController<TDbFormat, TJsonFormat>
        where TDbFormat : class, IConvertible<TJsonFormat>
        where TJsonFormat : class, IConvertible<TDbFormat>
    {
        public ModosithatoTablaController(AppDbContext context) : base(context)
        {

        }

        protected ActionResult Get(DbSet<TDbFormat> dbSet, params object?[]? pk) => CheckIfNotFound(dbSet, record => Ok(record.ConvertType()), pk);

        protected ActionResult Put(DbSet<TDbFormat> dbSet, TJsonFormat data, Action<TDbFormat, TDbFormat> updateRecord, params object?[]? pk) => CheckIfBadRequest(() => CheckIfNotFound(
            dbSet: dbSet,
            handleRequest: record => {
                updateRecord(record, data.ConvertType());
                return TrySave(record);
            },
            pk: pk
        ));
    }
}
