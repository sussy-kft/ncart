namespace Backend.DTOs
{
    public interface IMetadataDTO<out TDataType>
    {
        long ColumnIndex { get; }
        string ColumnName { get; }
        TDataType DataType { get; }
        bool IsNullable { get; }
        bool IsPartOfPK { get; }
        string? References { get; }
        int? CharacterMaximumLength { get; }
    }
}
