using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Allomas
    {
        [Key] public int Id { get; set; }
        [Required, MaxLength(64)] public string Nev { get; set; }
        [Required] public long Koord { get; set; }

        [JsonIgnore] public List<Vonal> _VonalakKezdoAll { get; set; }
        [JsonIgnore] public List<Vonal> _VonalakVegall { get; set; }
        [JsonIgnore] public List<Megall> _Megallok { get; set; }
    }
}
