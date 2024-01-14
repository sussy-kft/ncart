using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Allomas
    {
        [Key] public int Id { get; set; }
        [Required, MaxLength(64)] public string Nev { get; set; }
        [Required] public long Koord { get; set; }

        public List<Vonal> _VonalakKezdoAll { get; set; }
        public List<Vonal> _VonalakVegall { get; set; }
        public List<Megall> _Megallok { get; set; }
    }
}
