using Backend.DTOs;

namespace Backend
{
    public static class ExtensionMethods
    {
        public static bool SelectFirst<T>(this IEnumerable<T> collection, out T? value, Func<T, bool> predicate)
        {
            IReadOnlyList<T> values = collection.ToList();
            int i = 0;
            while (i < values.Count && !predicate(values[i]))
            {
                i++;
            }
            bool found = i < values.Count;
            value = found ? values[i] : default;
            return found;
        }

        public static IQueryable<IMetadataDTO<string>> OverrideReferences(this IQueryable<IMetadataDTO<string>> metadataDTOs, Func<IMetadataDTO<string>, bool> predicate, Func<IMetadataDTO<string>, string?> references) => metadataDTOs.Override(predicate, metadataDTO => metadataDTO.DataType, references);

        public static IQueryable<IMetadataDTO<object>> OverrideDataType<TDataType>(this IQueryable<IMetadataDTO<object>> metadataDTOs, Func<IMetadataDTO<object>, bool> predicate, Func<IMetadataDTO<object>, TDataType> dataType) where TDataType : class => metadataDTOs.Override(predicate, dataType, metadataDTO => metadataDTO.References);

        static IQueryable<IMetadataDTO<T>> Override<T, TDataType>(this IQueryable<IMetadataDTO<T>> metadataDTOs, Func<IMetadataDTO<T>, bool> predicate, Func<IMetadataDTO<T>, TDataType> dataType, Func<IMetadataDTO<T>, string?> references)
            where T : class
            where TDataType : class, T
        {
            List<IMetadataDTO<T>> overriddenMetadataDTOs = [];
            metadataDTOs.ToList().ForEach(metadataDTO => {
                overriddenMetadataDTOs.Add(!predicate(metadataDTO) ? metadataDTO : new MetadataDTO<TDataType> {
                    ColumnName = metadataDTO.ColumnName,
                    DataType = dataType(metadataDTO),
                    IsNullable = metadataDTO.IsNullable,
                    IsPartOfPK = metadataDTO.IsPartOfPK,
                    References = references(metadataDTO),
                    CharacterMaximumLength = metadataDTO.CharacterMaximumLength,
                });
            });
            return overriddenMetadataDTOs.AsQueryable();
        }
    }
}
