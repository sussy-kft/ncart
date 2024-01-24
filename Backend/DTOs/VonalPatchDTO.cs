using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class VonalPatchDTO
    {
        [MaxLength(4)] public string? VonalSzam { get; set; }
        public int? JarmuTipus { get; set; }
        public int? KezdoAll { get; set; }
        public int? Vegall { get; set; }
    }
}
