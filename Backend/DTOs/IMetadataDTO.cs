namespace Backend.DTOs
{
    public interface IMetadataDTO<out TDataType>
    {
        string ColumnName { get; }
        TDataType DataType { get; }
        bool IsNullable { get; }
        bool IsPartOfPK { get; }
        string? References { get; }
        int? CharacterMaximumLength { get; }
    }
}
