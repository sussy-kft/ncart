using Microsoft.EntityFrameworkCore.Migrations;
using Backend.Models;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class UjVonalVegallomasTrigger : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql($@"
                CREATE TRIGGER Uj_Vonal_Vegallomas ON Vonalak AFTER INSERT AS
                BEGIN
	                DECLARE @{nameof(Megall.Vonal)} INT
	                DECLARE @{nameof(Megall.Allomas)} INT
	                DECLARE @{nameof(Megall.ElozoMegallo)} INT
	                SELECT @{nameof(Megall.Vonal)} = {nameof(Vonal.Id)}, @{nameof(Megall.Allomas)} = {nameof(Vonal.Vegall)}, @{nameof(Megall.ElozoMegallo)} = {nameof(Vonal.KezdoAll)}
	                FROM inserted
	                INSERT INTO Megallok VALUES(@{nameof(Megall.Vonal)}, @{nameof(Megall.Allomas)}, @{nameof(Megall.ElozoMegallo)}, 1)
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TRIGGER Uj_Vonal_Vegallomas");
        }
    }
}
