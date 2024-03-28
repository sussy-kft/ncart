using Backend.Models;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class DropVonalUjKezdoVagyVegallomasTrigger : Migration
    {
		/* =============================================================================================
		 * 
		 * Ez az egész migrációs file és az előző együtt negálják egymást és ki is lehetne törölni őket,
		 * ha nem lenne egyikünk gépén se lefuttatva az előző,
		 * de nem tudom, hogy kinek van lefuttatva és kinek nincs,
		 * úgyhogy ennek itt kell maradnia.
		 * 
		 * !!! NE TÖRÖLD KI ŐKET !!!
		 * 
		 * - Hunor:
		 * 
		 * Saját magamnak, mert mikor írom a kódot, csak én és a jó Isten tudjuk mit csinál,
		 * de már akár napokkal is később már csak a jó Isten tudja.
		 * 
		 * =============================================================================================
		 */

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TRIGGER Uj_Kezdo_Vagy_Vegallomas");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
    }
}
