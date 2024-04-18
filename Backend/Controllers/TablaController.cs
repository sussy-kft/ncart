using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using Backend.ModelDTOBases;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Controllers
{
    public abstract class TablaController<TPrimaryKey, TDbFormat, TJsonFormat>(AppDbContext context, IConfiguration config) : JsonRecieverController(context, config)
        where TDbFormat : class, IConvertible<TJsonFormat>
        where TJsonFormat : class, IConvertible<TDbFormat>
    {
        protected abstract DbSet<TDbFormat> dbSet { get; }

        protected StatusCodeResult Status405 => StatusCode(405);

        [HttpGet, AllowAnonymous]
        public abstract IEnumerable<TJsonFormat> Get();

        [AllowAnonymous]
        public abstract ActionResult Get([FromRoute] TPrimaryKey pk);

        protected IQueryable<TJsonFormat> PerformGetAll() => ConvertAllToDTO(dbSet.ToList());

        protected ActionResult PerformGet(params object?[]? pk) => CheckIfNotFound(dbSet, record => Ok(record.ConvertType()), pk);

        [HttpPost]
        public abstract ActionResult Post([FromBody] TJsonFormat data);

        protected ActionResult PerformPost(TJsonFormat data) => CheckIfBadRequest(() => HandlePost(dbSet, data.ConvertType()));

        [HttpPut]
        public virtual ActionResult Put([FromBody] TJsonFormat data) => Status405;

        protected ActionResult PerformPut(TDbFormat data, params object?[]? pk) => CheckIfBadRequest(() => {
            TDbFormat? record = dbSet.Find(pk);
            return record is null ? HandlePost(dbSet, data) : TrySaveRecord(record!, record => {
                dbSet.Remove(record);
                dbSet.Add(data);
            });
        });

        protected ActionResult PerformPatch(Action<TDbFormat> updateRecord, params object?[]? pk) => CheckIfBadRequest(() => CheckIfNotFound(dbSet, record => TrySaveRecord(record, updateRecord), pk));

        public abstract ActionResult Delete([FromRoute] TPrimaryKey pk);

        [HttpDelete]
        public abstract ActionResult Delete();

        protected ActionResult PerformDelete(params object?[]? pk) => CheckIfNotFound(
            dbSet: dbSet,
            handleRequest: record => TrySaveRecord(record, record => {
                dbSet.Remove(record);
            }),
            pk: pk
        );

        protected ObjectResult PerformDeleteAll() => TrySaveRange(dbSet.ToList(), dbSet.RemoveRange);

        [HttpGet("metadata"), AllowAnonymous]
        public abstract IEnumerable<IMetadataDTO<object>> GetMetadata();

        protected IQueryable<IMetadataDTO<string>> PerformGetMetadata(string tableName)
        {
            IQueryable<Metadata> metadatas = context
                .Database
                .SqlQueryRaw<Metadata>(
                    $@"
                        SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS [ColumnIndex], *
                        FROM dbo.Metadata(@{nameof(tableName)})
                    ",
                    new SqlParameter(nameof(tableName), tableName)
                )
                .Where(metadata => !metadata.IsIdentity)
            ;
            List<IMetadataDTO<string>> metadataDTOs = [];
            metadatas
                .Select(group => group.ColumnName)
                .Distinct()
                .ToList()
                .ForEach(columnName => {
                    IQueryable<Metadata> thisColumnNameMetadatas = metadatas.Where(metadata => metadata.ColumnName == columnName);
                    IQueryable<Metadata> notNullConstraintNameMetadatas = thisColumnNameMetadatas.Where(metadata => metadata.ConstraintName != null);
                    Metadata metadata = thisColumnNameMetadatas.First();
                    (bool isPartOfPk, string? references) constraints = notNullConstraintNameMetadatas.Count() == 0 ? (false, null) : (notNullConstraintNameMetadatas.Where(metadata => metadata.ConstraintName!.StartsWith("PK")).Count() > 0, notNullConstraintNameMetadatas
                        .Where(metadata => metadata.ConstraintName!.StartsWith("FK"))
                        .Select(metadata => metadata.ConstraintName!)
                        .FirstOrDefault()?
                        .Split('_')[2]
                    );
                    metadataDTOs.Add(new MetadataDTO<string> {
                        ColumnIndex = metadata.ColumnIndex,
                        ColumnName = metadata.ColumnName,
                        DataType = metadata.DataType,
                        IsNullable = metadata.IsNullable,
                        IsPartOfPK = constraints.isPartOfPk,
                        References = constraints.references,
                        CharacterMaximumLength = metadata.CharacterMaximumLength,
                        IsHidden = false
                    });
                })
            ;
            return metadataDTOs.AsQueryable().OrderBy(metadataDTO => metadataDTO.ColumnIndex);
        }

        ActionResult HandlePost(DbSet<TDbFormat> dbSet, TDbFormat dbFormat) => TrySaveRecord(dbFormat, record => {
            dbSet.Add(record);
        });

        protected ObjectResult TrySaveRecord(TDbFormat record, Action<TDbFormat> action) => TrySave(record, action, record => record.ConvertType());

        protected ObjectResult TrySaveRange(IEnumerable<TDbFormat> records, Action<IEnumerable<TDbFormat>> action) => TrySave(records, action, ConvertAllToDTO);

        ObjectResult TrySave<TRecord, TJson>(TRecord record, Action<TRecord> action, Func<TRecord, TJson> convert)
            where TRecord : class
            where TJson : class
        => HandleError(() => {
            action(record);
            try
            {
                context.SaveChanges();
                return Ok(convert(record));
            }
            catch (DbUpdateConcurrencyException e)
            {
                return Conflict(e.InnerException?.Message);
            }
            catch (DbUpdateException e)
            {
                return BadRequest(e.InnerException?.Message);
            }
        });

        static IQueryable<TJsonFormat> ConvertAllToDTO(IEnumerable<TDbFormat> records) => records.ToList().ConvertAll(record => record.ConvertType()).AsQueryable();

        ActionResult CheckIfNotFound(DbSet<TDbFormat> dbSet, Func<TDbFormat, ActionResult> handleRequest, params object?[]? pk) => HandleError(() => {
            TDbFormat? record = dbSet.Find(pk);
            return record is not null ? handleRequest(record) : NotFound();
        });

        protected static void CheckIfNotNull<T>(T? value, Action<T> action) where T : class
        {
            if (value is not null)
            {
                action(value!);
            }
        }

        protected static void CheckIfNotNull<T>(T? value, Action<T> action) where T : struct
        {
            if (value is not null)
            {
                action((T)value);
            }
        }
    }
}
