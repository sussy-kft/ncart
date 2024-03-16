using Backend.Models;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class VonalakCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Megallok_Allomasok_ElozoMegallo",
                table: "Megallok"
            );
            migrationBuilder.AddForeignKey(
                name: "FK_Megallok_Allomasok_ElozoMegallo",
                table: "Megallok",
                column: "ElozoMegallo",
                principalTable: "Allomasok",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict
            );
            migrationBuilder.Sql($@"
                CREATE TRIGGER Vonalak_Cascade ON Vonalak INSTEAD OF DELETE AS
                BEGIN
	                DISABLE TRIGGER Megallo_Torol ON Megallok
	                DELETE FROM Megallok
	                WHERE {nameof(Megall.Vonal)} IN (
		                SELECT {nameof(Vonal.Id)}
		                FROM deleted
	                );
	                ENABLE TRIGGER Megallo_Torol ON Megallok
	                DELETE FROM Vonalak
	                WHERE {nameof(Vonal.Id)} = (
		                SELECT {nameof(Vonal.Id)}
		                FROM deleted
	                )
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Megallok_Allomasok_ElozoMegallo",
                table: "Megallok"
            );
            migrationBuilder.AddForeignKey(
                name: "FK_Megallok_Allomasok_ElozoMegallo",
                table: "Megallok",
                column: "ElozoMegallo",
                principalTable: "Allomasok",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
            migrationBuilder.Sql("DROP TRIGGER Vonalak_Cascade");
        }
    }
}
