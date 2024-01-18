using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class AllomasNyersKoordinatakkal
    {
        public int Id { get; set; }
        [Required, MaxLength(64)] public string Nev { get; set; }
        [Required] public Vector2 Koord { get; set; }

        public static implicit operator Allomas(AllomasNyersKoordinatakkal allomasNyersKoordinatakkal) => new Allomas {
            Id = allomasNyersKoordinatakkal.Id,
            Nev = allomasNyersKoordinatakkal.Nev,
            Koord = allomasNyersKoordinatakkal.Koord
        };
        public static implicit operator AllomasNyersKoordinatakkal(Allomas allomas) => new AllomasNyersKoordinatakkal {
            Id = allomas.Id,
            Nev = allomas.Nev,
            Koord = allomas.Koord
        };
    }
}
