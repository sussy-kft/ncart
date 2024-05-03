using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class Balls : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                CREATE FUNCTION dbo.Metadata(@TablaNev nvarchar(max)) RETURNS TABLE AS
                RETURN
	                SELECT
		                is_c.COLUMN_NAME AS ColumnName,
		                DATA_TYPE AS DataType,
		                s_c.is_nullable as IsNullable,
		                s_c.is_identity as IsIdentity,
		                is_kcu.CONSTRAINT_NAME as ConstraintName,
		                CHARACTER_MAXIMUM_LENGTH as CharacterMaximumLength
	                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE is_kcu
		                FULL OUTER JOIN INFORMATION_SCHEMA.COLUMNS is_c on is_kcu.COLUMN_NAME = is_c.COLUMN_NAME
		                FULL OUTER JOIN sys.columns s_c on is_c.COLUMN_NAME = s_c.name
	                WHERE ISNULL(is_kcu.TABLE_NAME, @TablaNev) = @TablaNev and is_c.TABLE_NAME = @TablaNev and object_id = object_id(@TablaNev)
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP FUNCTION dbo.Metadata");
        }
    }
}
