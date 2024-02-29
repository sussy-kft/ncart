using Backend.Models;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class igen : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Megallok_ElozoMegallo",
                table: "Megallok",
                column: "ElozoMegallo"
            );
            migrationBuilder.AddForeignKey(
                name: "FK_Megallok_Allomasok_ElozoMegallo",
                table: "Megallok",
                column: "ElozoMegallo",
                principalTable: "Allomasok",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict // Ezt elkúrtuk... Nem kicsit..., nagyon
            );
            migrationBuilder.Sql($@"
                CREATE FUNCTION dbo.UgyanolyanJarmuTipus(@{nameof(Vonal.VonalSzam)} nvarchar(4)) RETURNS BIT AS
                BEGIN
	                DECLARE @ret BIT = 1
	                IF (
		                SELECT COUNT(*)
		                FROM (
			                SELECT DISTINCT {nameof(Vonal.JarmuTipus)}
			                FROM Vonalak
			                WHERE {nameof(Vonal.VonalSzam)} = @{nameof(Vonal.VonalSzam)}
		                ) xd
	                ) > 1
		                SET @ret = 0
	                RETURN @ret
                END
            ");
            migrationBuilder.AddCheckConstraint(
                name: $"CK_Vonalak_{nameof(Vonal.JarmuTipus)}_Ugyanaz",
                table: "Vonalak",
                sql: $"dbo.UgyanolyanJarmuTipus({nameof(Vonal.VonalSzam)}) = 1"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Megallok_Allomasok_ElozoMegallo",
                table: "Megallok"
            );
            migrationBuilder.DropIndex(
                name: "IX_Megallok_ElozoMegallo",
                table: "Megallok"
            );
            migrationBuilder.DropCheckConstraint(
                name: $"CK_Vonalak_{nameof(Vonal.JarmuTipus)}_Ugyanaz",
                table: "Vonalak"
            );
            migrationBuilder.Sql("DROP FUNCTION dbo.UgyanolyanJarmuTipus");
        }
    }
}
