using Backend.Models;
using Microsoft.EntityFrameworkCore.Migrations;
using System.Collections.Specialized;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Allomasok",
                columns: table => new {
                    Id = table.Column<int>(type: "int", nullable: false).Annotation("SqlServer:Identity", "1, 1"),
                    Nev = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    Koord = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table => {
                    table.PrimaryKey("PK_Allomasok", x => x.Id);
                }
            );
            migrationBuilder.CreateTable(
                name: "JarmuTipusok",
                columns: table => new {
                    Id = table.Column<int>(type: "int", nullable: false).Annotation("SqlServer:Identity", "1, 1"),
                    Megnevezes = table.Column<string>(type: "nvarchar(16)", maxLength: 16, nullable: false)
                },
                constraints: table => {
                    table.PrimaryKey("PK_JarmuTipusok", x => x.Id);
                }
            );
            migrationBuilder.CreateTable(
                name: "Kezelok",
                columns: table => new {
                    Id = table.Column<int>(type: "int", nullable: false).Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Jelszo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Engedelyek = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table => {
                    table.PrimaryKey("PK_Kezelok", x => x.Id);
                }
            );
            migrationBuilder.CreateTable(
                name: "Vonalak",
                columns: table => new {
                    Id = table.Column<int>(type: "int", nullable: false).Annotation("SqlServer:Identity", "1, 1"),
                    VonalSzam = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: false),
                    JarmuTipus = table.Column<int>(type: "int", nullable: false),
                    KezdoAll = table.Column<int>(type: "int", nullable: false),
                    Vegall = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table => {
                    table.PrimaryKey("PK_Vonalak", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vonalak_Allomasok_KezdoAll",
                        column: x => x.KezdoAll,
                        principalTable: "Allomasok",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction
                    );
                    table.ForeignKey(
                        name: "FK_Vonalak_Allomasok_Vegall",
                        column: x => x.Vegall,
                        principalTable: "Allomasok",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction
                    );
                    table.ForeignKey(
                        name: "FK_Vonalak_JarmuTipusok_JarmuTipus",
                        column: x => x.JarmuTipus,
                        principalTable: "JarmuTipusok",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );
            migrationBuilder.CreateTable(
                name: "Inditasok",
                columns: table => new {
                    Vonal = table.Column<int>(type: "int", nullable: false),
                    Nap = table.Column<byte>(type: "tinyint", nullable: false),
                    InditasIdeje = table.Column<short>(type: "smallint", nullable: false)
                },
                constraints: table => {
                    table.PrimaryKey("PK_Inditasok", x => new { x.Vonal, x.Nap, x.InditasIdeje });
                    table.CheckConstraint("CK_Inditasok_InditasIdeje_Between", "InditasIdeje >= 0 AND InditasIdeje < 1440");
                    table.CheckConstraint("CK_Inditasok_Nap_Between", "Nap >= 1 AND Nap <= 8");
                    table.ForeignKey(
                        name: "FK_Inditasok_Vonalak_Vonal",
                        column: x => x.Vonal,
                        principalTable: "Vonalak",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );
            migrationBuilder.CreateTable(
                name: "Megallok",
                columns: table => new {
                    Vonal = table.Column<int>(type: "int", nullable: false),
                    Allomas = table.Column<int>(type: "int", nullable: false),
                    ElozoMegallo = table.Column<int>(type: "int", nullable: false),
                    HanyPerc = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table => {
                    table.PrimaryKey("PK_Megallok", x => new { x.Vonal, x.Allomas });
                    table.ForeignKey(
                        name: "FK_Megallok_Allomasok_Allomas",
                        column: x => x.Allomas,
                        principalTable: "Allomasok",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                    table.ForeignKey(
                        name: "FK_Megallok_Vonalak_Vonal",
                        column: x => x.Vonal,
                        principalTable: "Vonalak",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );
            migrationBuilder.CreateIndex(
                name: "IX_Kezelok_Email",
                table: "Kezelok",
                column: "Email",
                unique: true
            );
            migrationBuilder.CreateIndex(
                name: "IX_Megallok_Allomas",
                table: "Megallok",
                column: "Allomas"
            );
            migrationBuilder.CreateIndex(
                name: "IX_Vonalak_JarmuTipus",
                table: "Vonalak",
                column: "JarmuTipus"
            );
            migrationBuilder.CreateIndex(
                name: "IX_Vonalak_KezdoAll",
                table: "Vonalak",
                column: "KezdoAll"
            );
            migrationBuilder.CreateIndex(
                name: "IX_Vonalak_Vegall",
                table: "Vonalak",
                column: "Vegall"
            );
            migrationBuilder.Sql($@"
                CREATE FUNCTION dbo.Max2Vonal(@{nameof(Vonal.VonalSzam)} nvarchar(4)) RETURNS BIT AS
                BEGIN
                    DECLARE @ret BIT = 1
                    IF (
                        SELECT COUNT(*)
                        FROM Vonalak
                        WHERE {nameof(Vonal.VonalSzam)} = @{nameof(Vonal.VonalSzam)}
                    ) >= 2
                        SET @ret = 0
                    RETURN @ret
                END
            ");
            migrationBuilder.Sql($@"
                ALTER TABLE Vonalak
                ADD CONSTRAINT CK_Vonalak_{nameof(Vonal.VonalSzam)}_Max2
                CHECK (dbo.Max2Vonal({nameof(Vonal.VonalSzam)}) = 1)
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "Inditasok");
            migrationBuilder.DropTable(name: "Kezelok");
            migrationBuilder.DropTable(name: "Megallok");
            migrationBuilder.DropTable(name: "Vonalak");
            migrationBuilder.DropTable(name: "Allomasok");
            migrationBuilder.DropTable(name: "JarmuTipusok");
            migrationBuilder.Sql("DROP FUNCTION dbo.Max2Vonal");
        }
    }
}
