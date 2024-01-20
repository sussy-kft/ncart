using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Backend.DTOs;
using Backend.ModelDTOBases;

namespace Backend.Models
{
    public class Allomas : AllomasBase, IDbModel<AllomasDTO>
    {
        [Key] public int Id { get; set; }
        [Required] public long Koord { get; set; }

        [JsonIgnore] public List<Vonal> _VonalakKezdoAll { get; set; }
        [JsonIgnore] public List<Vonal> _VonalakVegall { get; set; }
        [JsonIgnore] public List<Megall> _Megallok { get; set; }

        public AllomasDTO ToDTO() => new AllomasDTO {
            Id = Id,
            Nev = Nev,
            Koord = Koord
        };
    }
}
