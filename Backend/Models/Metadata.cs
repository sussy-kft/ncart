namespace Backend.Models
{
    public class Metadata
    {
        public string ColumnName { get; set; }
        public string DataType { get; set; }
        public bool IsNullable { get; set; }
        public bool IsIdentity { get; set; }
        public string? ConstraintName { get; set; }
        public int? CharacterMaximumLength { get; set; }
    }
}
