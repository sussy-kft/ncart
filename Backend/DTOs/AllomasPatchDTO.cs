using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class AllomasPatchDTO
    {
        [MaxLength(64)] public string? Nev { get; set; }
        public Vector2? Koord { get; set; }
    }
}
