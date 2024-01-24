using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    public abstract class KulonModosithatoTablaController<TDbFormat, TJsonFormat> : ModosithatoTablaController<TDbFormat, TJsonFormat>
        where TDbFormat : class, IConvertible<TJsonFormat>
        where TJsonFormat : class, IConvertible<TDbFormat>
    {
        public KulonModosithatoTablaController(AppDbContext context) : base(context)
        {

        }

        protected ActionResult Patch(DbSet<TDbFormat> dbSet, Action<TDbFormat> updateRecord, params object?[]? pk) => CheckIfBadRequest(() => CheckIfNotFound(
            dbSet: dbSet,
            handleRequest: record => {
                updateRecord(record);
                return TrySave(record);
            },
            pk: pk
        ));

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
