using Microsoft.EntityFrameworkCore.Migrations;
using Backend.Models;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class LetezoMegalloConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql($@"
                CREATE FUNCTION dbo.LetezoMegallo(@{nameof(Megall.Vonal)} INT, @{nameof(Megall.ElozoMegallo)} INT) RETURNS BIT AS
                BEGIN
	                DECLARE @ret BIT = 1
	                IF @{nameof(Megall.ElozoMegallo)} NOT IN (
		                SELECT {nameof(Megall.Allomas)}
		                FROM Megallok
		                WHERE {nameof(Megall.Vonal)} = @{nameof(Megall.Vonal)}
	                ) AND @{nameof(Megall.ElozoMegallo)} <> (
		                SELECT {nameof(Vonal.KezdoAll)}
		                FROM Vonalak
		                WHERE {nameof(Vonal.Id)} = @{nameof(Megall.Vonal)}
	                )
		                SET @ret = 0
	                RETURN @ret
                END
            ");
            migrationBuilder.AddCheckConstraint(
                name: "CK_Megallok_LetezoMegallo",
                table: "Megallok",
                sql: $"dbo.LetezoMegallo({nameof(Megall.Vonal)}, {nameof(Megall.ElozoMegallo)}) = 1"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Megallok_LetezoMegallo",
                table: "Megallok"
            );
            migrationBuilder.Sql("DROP FUNCTION dbo.LetezoMegallo");
        }
    }
}
