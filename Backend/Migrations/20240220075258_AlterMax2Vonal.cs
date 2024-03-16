using Microsoft.EntityFrameworkCore.Migrations;
using Backend.Models;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AlterMax2Vonal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: $"CK_Vonalak_{nameof(Vonal.VonalSzam)}_Max2",
                table: "Vonalak"
            );
            migrationBuilder.DropCheckConstraint(
                name: $"CK_Vonalak_{nameof(Vonal.JarmuTipus)}_Ugyanaz",
                table: "Vonalak"
            );
            migrationBuilder.Sql("DROP FUNCTION dbo.UgyanolyanJarmuTipus");
            migrationBuilder.Sql($@"
                ALTER FUNCTION dbo.Max2Vonal(@{nameof(Vonal.JarmuTipus)} int, @{nameof(Vonal.VonalSzam)} nvarchar(4)) RETURNS BIT AS
                BEGIN
	                DECLARE @ret BIT = 1
	                IF (
		                SELECT COUNT(*)
		                FROM Vonalak
		                WHERE {nameof(Vonal.JarmuTipus)} = @{nameof(Vonal.JarmuTipus)} AND {nameof(Vonal.VonalSzam)} = @{nameof(Vonal.VonalSzam)}
	                ) > 2
		                SET @ret = 0
	                RETURN @ret
                END
            ");
            migrationBuilder.AddCheckConstraint(
                name: $"CK_Vonalak_Max2",
                table: "Vonalak",
                sql: $"dbo.Max2Vonal({nameof(Vonal.JarmuTipus)}, {nameof(Vonal.VonalSzam)}) = 1"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: $"CK_Vonalak_Max2",
                table: "Vonalak"
            );
            migrationBuilder.Sql($@"
                ALTER FUNCTION dbo.Max2Vonal(@{nameof(Vonal.VonalSzam)} nvarchar(4)) RETURNS BIT AS
                BEGIN
                    DECLARE @ret BIT = 1
                    IF (
                        SELECT COUNT(*)
                        FROM Vonalak
                        WHERE {nameof(Vonal.VonalSzam)} = @{nameof(Vonal.VonalSzam)}
                    ) > 2
                        SET @ret = 0
                    RETURN @ret
                END
            ");
            migrationBuilder.AddCheckConstraint(
                name: $"CK_Vonalak_{nameof(Vonal.VonalSzam)}_Max2",
                table: "Vonalak",
                sql: $"dbo.Max2Vonal({nameof(Vonal.VonalSzam)}) = 1"
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
    }
}
