using Microsoft.EntityFrameworkCore.Migrations;
using Backend.Models;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class MegallTriggerek : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql($@"
                CREATE TRIGGER Vonal_Bovitve ON Megallok AFTER INSERT AS
                BEGIN
                    DECLARE @{nameof(Megall.Vonal)} INT
                    DECLARE @{nameof(Megall.Allomas)} INT
                    DECLARE @{nameof(Megall.ElozoMegallo)} INT
                    SELECT @{nameof(Megall.Vonal)} = {nameof(Megall.Vonal)}, @{nameof(Megall.Allomas)} = {nameof(Megall.Allomas)}, @{nameof(Megall.ElozoMegallo)} = {nameof(Megall.ElozoMegallo)}
                    FROM inserted
                    IF @{nameof(Megall.ElozoMegallo)} = (
                        SELECT {nameof(Vonal.Vegall)}
                        FROM Vonalak
                        WHERE {nameof(Vonal.Id)} = @{nameof(Megall.Vonal)}
                    )
                    BEGIN
                        UPDATE Vonalak
                        SET {nameof(Vonal.Vegall)} = @{nameof(Megall.Allomas)}
                        WHERE {nameof(Vonal.Id)} = @{nameof(Megall.Vonal)}
                    END
                END
            ");
            migrationBuilder.Sql($@"
                CREATE TRIGGER Vonal_Roviditve ON Megallok AFTER DELETE AS
                BEGIN
                    DECLARE @{nameof(Megall.Vonal)} INT
                    DECLARE @{nameof(Megall.Allomas)} INT
                    DECLARE @{nameof(Megall.ElozoMegallo)} INT
                    SELECT @{nameof(Megall.Vonal)} = {nameof(Megall.Vonal)}, @{nameof(Megall.Allomas)} = {nameof(Megall.Allomas)}, @{nameof(Megall.ElozoMegallo)} = {nameof(Megall.ElozoMegallo)}
                    FROM deleted
                    IF @{nameof(Megall.Allomas)} = (
                        SELECT {nameof(Vonal.Vegall)}
                        FROM Vonalak
                        WHERE {nameof(Vonal.Id)} = @{nameof(Megall.Vonal)}
                    )
                    BEGIN
                        UPDATE Vonalak
                        SET {nameof(Vonal.Vegall)} = @{nameof(Megall.ElozoMegallo)}
                        WHERE {nameof(Vonal.Id)} = @{nameof(Megall.Vonal)}
                    END
                END
            ");
            migrationBuilder.Sql($@"
                CREATE TRIGGER Kezdo_All_Megvaltozott ON Megallok AFTER UPDATE AS
                BEGIN
	                IF UPDATE({nameof(Megall.ElozoMegallo)})
	                BEGIN
		                DECLARE @{nameof(Megall.Vonal)} INT
		                DECLARE @{nameof(Megall.ElozoMegallo)} INT
		                SELECT @{nameof(Megall.Vonal)} = {nameof(Megall.Vonal)}, @{nameof(Megall.ElozoMegallo)} = {nameof(Megall.ElozoMegallo)}
		                FROM deleted
		                IF @{nameof(Megall.ElozoMegallo)} = (
			                SELECT {nameof(Vonal.KezdoAll)}
			                FROM Vonalak
			                WHERE {nameof(Vonal.Id)} = @{nameof(Megall.Vonal)}
		                )
		                BEGIN
			                UPDATE Vonalak
			                SET {nameof(Vonal.KezdoAll)} = (
				                SELECT {nameof(Megall.ElozoMegallo)}
				                FROM inserted
			                )
			                WHERE {nameof(Vonal.Id)} = @{nameof(Megall.Vonal)}
		                END
	                END
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TRIGGER Vonal_Bovitve");
            migrationBuilder.Sql("DROP TRIGGER Vonal_Roviditve");
            migrationBuilder.Sql("DROP TRIGGER Kezdo_All_Megvaltozott");
        }
    }
}
