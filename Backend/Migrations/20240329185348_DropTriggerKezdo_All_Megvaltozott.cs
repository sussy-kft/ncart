using Microsoft.EntityFrameworkCore.Migrations;
using Backend.Models;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class DropTriggerKezdo_All_Megvaltozott : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TRIGGER Kezdo_All_Megvaltozott");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
    }
}
