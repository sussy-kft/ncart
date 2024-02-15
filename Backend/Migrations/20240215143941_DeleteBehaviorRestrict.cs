using Backend.Models;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class DeleteBehaviorRestrict : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Megallok_Allomasok_Allomas",
                table: "Megallok"
            );
            migrationBuilder.DropForeignKey(
                name: "FK_Megallok_Allomasok_ElozoMegallo",
                table: "Megallok"
            );
            migrationBuilder.DropForeignKey(
                name: "FK_Megallok_Vonalak_Vonal",
                table: "Megallok"
            );
            migrationBuilder.DropForeignKey(
                name: "FK_Vonalak_Allomasok_KezdoAll",
                table: "Vonalak"
            );
            migrationBuilder.DropForeignKey(
                name: "FK_Vonalak_Allomasok_Vegall",
                table: "Vonalak"
            );
            migrationBuilder.DropForeignKey(
                name: "FK_Vonalak_JarmuTipusok_JarmuTipus",
                table: "Vonalak"
            );
            migrationBuilder.AddForeignKey(
                name: "FK_Megallok_Allomasok_Allomas",
                table: "Megallok",
                column: "Allomas",
                principalTable: "Allomasok",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict
            );
            migrationBuilder.AddForeignKey(
                name: "FK_Megallok_Allomasok_ElozoMegallo",
                table: "Megallok",
                column: "ElozoMegallo",
                principalTable: "Allomasok",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict
            );
            migrationBuilder.AddForeignKey(
                name: "FK_Megallok_Vonalak_Vonal",
                table: "Megallok",
                column: "Vonal",
                principalTable: "Vonalak",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict
            );
            migrationBuilder.AddForeignKey(
                name: "FK_Vonalak_Allomasok_KezdoAll",
                table: "Vonalak",
                column: "KezdoAll",
                principalTable: "Allomasok",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict
            );
            migrationBuilder.AddForeignKey(
                name: "FK_Vonalak_Allomasok_Vegall",
                table: "Vonalak",
                column: "Vegall",
                principalTable: "Allomasok",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict
            );
            migrationBuilder.AddForeignKey(
                name: "FK_Vonalak_JarmuTipusok_JarmuTipus",
                table: "Vonalak",
                column: "JarmuTipus",
                principalTable: "JarmuTipusok",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict
            );
            migrationBuilder.Sql($@"
                CREATE TRIGGER Megallo_Beszur ON Megallok AFTER INSERT AS
                BEGIN
                    DECLARE @{nameof(Megall.ElozoMegallo)} INT
                    DECLARE @{nameof(Megall.Allomas)} INT
                    DECLARE @{nameof(Megall.Vonal)} INT
                    SELECT @{nameof(Megall.Allomas)} = {nameof(Megall.Allomas)}, @{nameof(Megall.Vonal)} = {nameof(Megall.Vonal)}, @{nameof(Megall.ElozoMegallo)} = {nameof(Megall.ElozoMegallo)}
                    FROM inserted
                    UPDATE Megallok
                    SET {nameof(Megall.ElozoMegallo)} = @{nameof(Megall.Allomas)}
                    WHERE {nameof(Megall.Vonal)} = @{nameof(Megall.Vonal)} AND {nameof(Megall.Allomas)} <> @{nameof(Megall.Allomas)} AND {nameof(Megall.ElozoMegallo)} = @{nameof(Megall.ElozoMegallo)}
                END
            ");
            migrationBuilder.Sql($@"
                CREATE TRIGGER Megallo_Torol ON Megallok INSTEAD OF DELETE AS
                BEGIN
                    DECLARE @{nameof(Megall.ElozoMegallo)} INT
                    DECLARE @{nameof(Megall.Allomas)} INT
	                DECLARE @{nameof(Megall.Vonal)} INT
                    SELECT @{nameof(Megall.ElozoMegallo)} = {nameof(Megall.ElozoMegallo)}, @{nameof(Megall.Allomas)} = {nameof(Megall.Allomas)}, @{nameof(Megall.Vonal)} = {nameof(Megall.Vonal)}
                    FROM deleted
	                UPDATE Megallok
	                SET {nameof(Megall.ElozoMegallo)} = @{nameof(Megall.ElozoMegallo)}
	                WHERE {nameof(Megall.Vonal)} = @{nameof(Megall.Vonal)} AND {nameof(Megall.Allomas)} <> @{nameof(Megall.Allomas)} AND {nameof(Megall.ElozoMegallo)} = @{nameof(Megall.Allomas)}
                    DELETE FROM Megallok
                    WHERE {nameof(Megall.Vonal)} = @{nameof(Megall.Vonal)} AND {nameof(Megall.Allomas)} = @{nameof(Megall.Allomas)}
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Megallok_Allomasok_Allomas",
                table: "Megallok"
            );
            migrationBuilder.DropForeignKey(
                name: "FK_Megallok_Allomasok_ElozoMegallo",
                table: "Megallok"
            );
            migrationBuilder.DropForeignKey(
                name: "FK_Megallok_Vonalak_Vonal",
                table: "Megallok"
            );
            migrationBuilder.DropForeignKey(
                name: "FK_Vonalak_Allomasok_KezdoAll",
                table: "Vonalak"
            );
            migrationBuilder.DropForeignKey(
                name: "FK_Vonalak_Allomasok_Vegall",
                table: "Vonalak"
            );
            migrationBuilder.DropForeignKey(
                name: "FK_Vonalak_JarmuTipusok_JarmuTipus",
                table: "Vonalak"
            );
            migrationBuilder.AddForeignKey(
                name: "FK_Megallok_Allomasok_Allomas",
                table: "Megallok",
                column: "Allomas",
                principalTable: "Allomasok",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
            migrationBuilder.AddForeignKey(
                name: "FK_Megallok_Allomasok_ElozoMegallo",
                table: "Megallok",
                column: "ElozoMegallo",
                principalTable: "Allomasok",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
            migrationBuilder.AddForeignKey(
                name: "FK_Megallok_Vonalak_Vonal",
                table: "Megallok",
                column: "Vonal",
                principalTable: "Vonalak",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
            migrationBuilder.AddForeignKey(
                name: "FK_Vonalak_Allomasok_KezdoAll",
                table: "Vonalak",
                column: "KezdoAll",
                principalTable: "Allomasok",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
            migrationBuilder.AddForeignKey(
                name: "FK_Vonalak_Allomasok_Vegall",
                table: "Vonalak",
                column: "Vegall",
                principalTable: "Allomasok",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
            migrationBuilder.AddForeignKey(
                name: "FK_Vonalak_JarmuTipusok_JarmuTipus",
                table: "Vonalak",
                column: "JarmuTipus",
                principalTable: "JarmuTipusok",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade
            );
            migrationBuilder.Sql("DROP TRIGGER Megallo_Beszur");
            migrationBuilder.Sql("DROP TRIGGER Megallo_Torol");
        }
    }
}
