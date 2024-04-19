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

        public static IEnumerable<IMetadataDTO<string>> OverrideReferences(this IEnumerable<IMetadataDTO<string>> metadataDTOs, Func<IMetadataDTO<string>, bool> predicate, Func<IMetadataDTO<string>, string?> references) => metadataDTOs.Override(predicate, metadataDTO => metadataDTO.DataType, references);

        public static IEnumerable<IMetadataDTO<object>> OverrideDataType<TDataType>(this IEnumerable<IMetadataDTO<object>> metadataDTOs, Func<IMetadataDTO<object>, bool> predicate, Func<IMetadataDTO<object>, TDataType> dataType) where TDataType : class => metadataDTOs.Override(predicate, dataType, metadataDTO => metadataDTO.References);

        static IEnumerable<IMetadataDTO<T>> Override<T, TDataType>(this IEnumerable<IMetadataDTO<T>> metadataDTOs, Func<IMetadataDTO<T>, bool> predicate, Func<IMetadataDTO<T>, TDataType> dataType, Func<IMetadataDTO<T>, string?> references)
            where T : class
            where TDataType : class, T
        {
            List<IMetadataDTO<T>> overriddenMetadataDTOs = [];
            metadataDTOs.ToList().ForEach(metadataDTO => {
                overriddenMetadataDTOs.Add(!predicate(metadataDTO) ? metadataDTO : new MetadataDTO<TDataType> {
                    ColumnIndex = metadataDTO.ColumnIndex,
                    ColumnName = metadataDTO.ColumnName,
                    DataType = dataType(metadataDTO),
                    IsNullable = metadataDTO.IsNullable,
                    IsPartOfPK = metadataDTO.IsPartOfPK,
                    References = references(metadataDTO),
                    CharacterMaximumLength = metadataDTO.CharacterMaximumLength,
                    IsHidden = metadataDTO.IsHidden
                });
            });
            return overriddenMetadataDTOs.AsQueryable();
        }

        public static IEnumerable<IMetadataDTO<object>> OverrideSetIsHiddenTrue(this IEnumerable<IMetadataDTO<object>> metadataDTOs, Func<IMetadataDTO<object>, bool> predicate) => metadataDTOs.ForEach(metadataDTO => {
            if (predicate(metadataDTO))
            {
                metadataDTO.SetIsHiddenTrue();
            }
        });

        public static IEnumerable<T> ForEach<T>(this IEnumerable<T> items, Action<T> action)
        {
            items.ToList().ForEach(action);
            return items;
        }
    }
}
