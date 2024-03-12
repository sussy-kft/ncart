namespace Backend.DTOs
{
    public class MetadataDTO<TDataType> : IMetadataDTO<TDataType>
    {
        public long ColumnIndex { get; set; }
        public string ColumnName { get; set; }
        public TDataType DataType { get; set; }
        public bool IsNullable { get; set; }
        public bool IsPartOfPK { get; set; }
        public string? References { get; set; }
        public int? CharacterMaximumLength { get; set; }
        public bool IsHidden { get; set; }

        public void SetIsHiddenTrue()
        {
            IsHidden = true;
        }
    }
}
