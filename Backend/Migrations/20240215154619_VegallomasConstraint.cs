using Backend.Models;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class VegallomasConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql($@"
                CREATE FUNCTION dbo.Vegallomas(@{nameof(Megall.Vonal)} INT, @{nameof(Megall.ElozoMegallo)} INT) RETURNS BIT AS
                BEGIN
	                DECLARE @ret BIT = 1
	                IF @{nameof(Megall.ElozoMegallo)} = (
		                SELECT {nameof(Vonal.Vegall)}
		                FROM Vonalak
		                WHERE Id = @{nameof(Megall.Vonal)}
	                )
		                SET @ret = 0
	                RETURN @ret
                END
            ");
            migrationBuilder.Sql($@"
                ALTER TABLE Megallok
                ADD CONSTRAINT CK_Vegallomas
                CHECK (dbo.Vegallomas({nameof(Megall.Vonal)}, {nameof(Megall.ElozoMegallo)}) = 1)
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Vegallomas",
                table: "Megallok"
            );
        }
    }
}
