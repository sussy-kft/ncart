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
        [HttpGet, AllowAnonymous]
        public abstract IEnumerable<TJsonFormat> Get();

        [AllowAnonymous]
        public abstract ActionResult Get([FromRoute] TPrimaryKey pk);

        protected IQueryable<TJsonFormat> GetAll(DbSet<TDbFormat> dbSet) => ConvertAllToDTO(dbSet.ToList());

        protected ActionResult Get(DbSet<TDbFormat> dbSet, params object?[]? pk) => CheckIfNotFound(dbSet, record => Ok(record.ConvertType()), pk);

        [HttpPost]
        public abstract ActionResult Post([FromBody] TJsonFormat data);

        protected ActionResult Post(DbSet<TDbFormat> dbSet, TJsonFormat data) => CheckIfBadRequest(() => {
            TDbFormat dbFormat = data.ConvertType();
            return TrySaveRecord(dbFormat, record => {
                dbSet.Add(record);
            });
        });

        public abstract ActionResult Put([FromRoute] TPrimaryKey pk, [FromBody] TJsonFormat data);

        protected ActionResult Put(DbSet<TDbFormat> dbSet, TJsonFormat data, Action<TDbFormat, TDbFormat> updateRecord, params object?[]? pk) => CheckAll(
            dbSet: dbSet,
            handleRequest: record => TrySaveRecord(record, record => {
                updateRecord(record, data.ConvertType());
            }),
            pk: pk
        );

        protected ActionResult Patch(DbSet<TDbFormat> dbSet, Action<TDbFormat> updateRecord, params object?[]? pk) => CheckAll(dbSet, record => TrySaveRecord(record, updateRecord), pk);

        public abstract ActionResult Delete([FromRoute] TPrimaryKey pk);

        [HttpDelete]
        public abstract ActionResult Delete();

        protected ActionResult Delete(DbSet<TDbFormat> dbSet, params object?[]? pk) => CheckIfNotFound(
            dbSet: dbSet,
            handleRequest: record => TrySaveRecord(record, record => {
                dbSet.Remove(record);
            }),
            pk: pk
        );

        protected ObjectResult DeleteAll(DbSet<TDbFormat> dbSet) => TrySaveRange(dbSet.ToList(), dbSet.RemoveRange);

        [HttpGet("metadata"), AllowAnonymous]
        public abstract IEnumerable<IMetadataDTO<object>> Metadata();

        protected IQueryable<IMetadataDTO<string>> Metadata(string tableName)
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
            List<IMetadataDTO<string>> metadataDTOs = new List<IMetadataDTO<string>>();
            metadatas
                .Select(group => group.ColumnName)
                .Distinct()
                .ToList()
                .ForEach(columnName => {
                    IQueryable<Metadata> thisColumnNameMetadatas = metadatas.Where(metadata => metadata.ColumnName == columnName);
                    IQueryable<Metadata> notNullConstraintNameMetadatas = thisColumnNameMetadatas.Where(metadata => metadata.ConstraintName != null);
                    Metadata metadata = thisColumnNameMetadatas.First();
                    (bool isPartOfPk, string? references) constraints = notNullConstraintNameMetadatas.Count() > 0
                        ? (
                            notNullConstraintNameMetadatas.Where(metadata => metadata.ConstraintName!.StartsWith("PK")).Count() > 0,
                            ((Func<string?>)(() => {
                                IQueryable<Metadata> foreignKeys = notNullConstraintNameMetadatas.Where(metadata => metadata.ConstraintName!.StartsWith("FK"));
                                return foreignKeys.Count() > 0
                                    ? foreignKeys
                                        .Select(metadata => metadata.ConstraintName!)
                                        .First()
                                        .Split("_")[2]
                                    : null
                                ;
                            }))()
                        )
                        : (false, null)
                    ;
                    metadataDTOs.Add(new MetadataDTO<string>
                    {
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

        protected ObjectResult TrySaveRecord(TDbFormat record, Action<TDbFormat> action) => TrySave(record, action, record.ConvertType);

        protected ObjectResult TrySaveRange(IReadOnlyList<TDbFormat> records, Action<IReadOnlyList<TDbFormat>> action) => TrySave(records, action, () => ConvertAllToDTO(records));

        ObjectResult TrySave<TRecord, TJson>(TRecord record, Action<TRecord> action, Func<TJson> convert)
            where TRecord : class
            where TJson : class
        {
            action(record);
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
            catch (InvalidOperationException e)
            {
                return StatusCode(500, e.InnerException?.Message);
            }
        }

        static IQueryable<TJsonFormat> ConvertAllToDTO(IReadOnlyList<TDbFormat> records) => records.ToList().ConvertAll(record => record.ConvertType()).AsQueryable();

        ActionResult CheckAll(DbSet<TDbFormat> dbSet, Func<TDbFormat, ActionResult> handleRequest, params object?[]? pk) => CheckIfBadRequest(() => CheckIfNotFound(dbSet, handleRequest, pk));

        ActionResult CheckIfNotFound(DbSet<TDbFormat> dbSet, Func<TDbFormat, ActionResult> handleRequest, params object?[]? pk)
        {
            TDbFormat? record = dbSet.Find(pk);
            return record != null ? handleRequest(record) : NotFound();
        }

        protected ActionResult NotFoundIfQueryIsEmpty<T>(Func<IReadOnlyList<T>> query)
        {
            IReadOnlyList<T> queryResult = query();
            return queryResult.Count > 0 ? Ok(queryResult) : NotFound();
        }

        protected StatusCodeResult Status405 => StatusCode(405);

        protected StatusCodeResult Status500 => StatusCode(500);

        protected static void CheckIfNotNull<T>(T? value, Action<T> action) where T : class
        {
            if (value is not null)
            {
                action(value);
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
