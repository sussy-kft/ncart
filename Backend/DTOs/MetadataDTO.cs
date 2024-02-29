namespace Backend.DTOs
{
    public class MetadataDTO<TDataType> : IMetadataDTO<TDataType>
    {
        public string ColumnName { get; set; }
        public TDataType DataType { get; set; }
        public bool IsNullable { get; set; }
        public bool IsPartOfPK { get; set; }
        public string? References { get; set; }
        public int? CharacterMaximumLength { get; set; }
    }
}
