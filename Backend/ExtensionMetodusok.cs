using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.ModelDTOBases;
using Backend.Controllers;

namespace Backend
{
    public static class ExtensionMetodusok
    {
        public static ActionResult Get<TDbFormat, TJsonFormat>(this TablaController<TDbFormat, TJsonFormat> controller, DbSet<TDbFormat> dbSet, params object?[]? pk)
            where TDbFormat : class, IConvertible<TJsonFormat>
            where TJsonFormat : class, IConvertible<TDbFormat>
            => controller.CheckIfNotFound(dbSet, record => controller.Ok(record.ConvertType()), pk)
        ;

        public static ActionResult Put<TDbFormat, TJsonFormat>(this TablaController<TDbFormat, TJsonFormat> controller, DbSet<TDbFormat> dbSet, TJsonFormat data, Action<TDbFormat, TDbFormat> updateRecord, params object?[]? pk)
            where TDbFormat : class, IConvertible<TJsonFormat>
            where TJsonFormat : class, IConvertible<TDbFormat>
            => controller.CheckAll(
                dbSet: dbSet,
                handleRequest: record => controller.TrySaveRecord(record, record =>
                {
                    updateRecord(record, data.ConvertType());
                }),
                pk: pk
            )
        ;

        public static ActionResult Patch<TDbFormat, TJsonFormat>(this TablaController<TDbFormat, TJsonFormat> controller, DbSet<TDbFormat> dbSet, Action<TDbFormat> updateRecord, params object?[]? pk)
            where TDbFormat : class, IConvertible<TJsonFormat>
            where TJsonFormat : class, IConvertible<TDbFormat>
            => controller.CheckAll(dbSet, record => controller.TrySaveRecord(record, updateRecord), pk)
        ;

        public static ObjectResult TrySaveRecord<TDbFormat, TJsonFormat>(this TablaController<TDbFormat, TJsonFormat> controller, TDbFormat record, Action<TDbFormat> action)
            where TDbFormat : class, IConvertible<TJsonFormat>
            where TJsonFormat : class, IConvertible<TDbFormat>
            => controller.TrySave(record, action, record.ConvertType)
        ;

        public static ObjectResult TrySaveRange<TDbFormat, TJsonFormat>(this TablaController<TDbFormat, TJsonFormat> controller, IReadOnlyList<TDbFormat> records, Action<IReadOnlyList<TDbFormat>> action)
            where TDbFormat : class, IConvertible<TJsonFormat>
            where TJsonFormat : class, IConvertible<TDbFormat>
            => controller.TrySave(records, action, () => TablaController<TDbFormat, TJsonFormat>.ConvertAllToDTO(records))
        ;

        static ObjectResult TrySave<TDbFormat, TJsonFormat, TRecord, TJson>(this TablaController<TDbFormat, TJsonFormat> controller, TRecord record, Action<TRecord> action, Func<TJson> convert)
            where TDbFormat : class, IConvertible<TJsonFormat>
            where TJsonFormat : class, IConvertible<TDbFormat>
            where TRecord : class
            where TJson : class
        {
            action(record);
            try
            {
                controller.Context.SaveChanges();
                return controller.Ok(convert());
            }
            catch (DbUpdateConcurrencyException e)
            {
                return controller.Conflict(e.InnerException?.Message);
            }
            catch (DbUpdateException e)
            {
                return controller.BadRequest(e.InnerException?.Message);
            }
        }

        static ActionResult CheckAll<TDbFormat, TJsonFormat>(this TablaController<TDbFormat, TJsonFormat> controller, DbSet<TDbFormat> dbSet, Func<TDbFormat, ActionResult> handleRequest, params object?[]? pk)
            where TDbFormat : class, IConvertible<TJsonFormat>
            where TJsonFormat : class, IConvertible<TDbFormat>
            => controller.CheckIfBadRequest(() => controller.CheckIfNotFound(dbSet, handleRequest, pk))
        ;

        public static ActionResult CheckIfNotFound<TDbFormat, TJsonFormat>(this TablaController<TDbFormat, TJsonFormat> controller, DbSet<TDbFormat> dbSet, Func<TDbFormat, ActionResult> handleRequest, params object?[]? pk)
            where TDbFormat : class, IConvertible<TJsonFormat>
            where TJsonFormat : class, IConvertible<TDbFormat>
        {
            TDbFormat? record = dbSet.Find(pk);
            return record != null ? handleRequest(record) : controller.NotFound();
        }

        public static ActionResult CheckIfBadRequest(this JsonRecieverController controller, Func<ActionResult> handleRequest) => controller.ModelState.IsValid ? handleRequest() : controller.BadRequest(controller.ModelState);
    }
}
