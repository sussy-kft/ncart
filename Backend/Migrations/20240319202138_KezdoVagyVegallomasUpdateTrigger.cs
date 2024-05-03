using Microsoft.EntityFrameworkCore.Migrations;
using Backend.Models;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class KezdoVagyVegallomasUpdateTrigger : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql($@"
                CREATE TRIGGER Uj_Kezdo_Vagy_Vegallomas ON Vonalak AFTER UPDATE AS
				BEGIN
					IF UPDATE({nameof(Vonal.KezdoAll)})
					BEGIN
						UPDATE Megallok
						SET {nameof(Megall.ElozoMegallo)} = (
							SELECT {nameof(Vonal.KezdoAll)}
							FROM inserted
						)
						WHERE {nameof(Megall.Vonal)} = (
							SELECT {nameof(Vonal.Id)}
							FROM deleted
						) AND {nameof(Megall.ElozoMegallo)} = (
							SELECT {nameof(Vonal.KezdoAll)}
							FROM deleted
						)
					END
					IF UPDATE({nameof(Vonal.Vegall)})
					BEGIN
						UPDATE Megallok
						SET {nameof(Megall.Allomas)} = (
							SELECT {nameof(Vonal.Vegall)}
							FROM inserted
						)
						WHERE {nameof(Megall.Vonal)} = (
							SELECT {nameof(Vonal.Id)}
							FROM deleted
						) AND {nameof(Megall.Allomas)} = (
							SELECT {nameof(Vonal.Vegall)}
							FROM deleted
						)
					END
				END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
			migrationBuilder.Sql("DROP TRIGGER Uj_Kezdo_Vagy_Vegallomas");
        }
    }
}
