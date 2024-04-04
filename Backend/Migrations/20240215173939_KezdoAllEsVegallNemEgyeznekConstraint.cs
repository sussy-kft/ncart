using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class KezdoAllEsVegallNemEgyeznekConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddCheckConstraint(
                name: "CK_Vonalak_KezdoAll_Es_Vegall_Nem_Egegyeznek",
                table: "Vonalak",
                sql: "KezdoAll <> Vegall"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Vonalak_KezdoAll_Es_Vegall_Nem_Egegyeznek",
                table: "Vonalak"
            );
        }
    }
}
