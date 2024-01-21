using System.ComponentModel.DataAnnotations;
using Backend.DTOs;
using Backend.ModelDTOBases;

namespace Backend.Models
{
    public class Allomas : AllomasBase, IConvertible<AllomasDTO>
    {
        [Key] public int Id { get; set; }
        [Required] public long Koord { get; set; }

        public List<Vonal> _VonalakKezdoAll { get; set; }
        public List<Vonal> _VonalakVegall { get; set; }
        public List<Megall> _Megallok { get; set; }

        public AllomasDTO ConvertType() => new AllomasDTO {
            Id = Id,
            Nev = Nev,
            Koord = Koord
        };
    }
}
