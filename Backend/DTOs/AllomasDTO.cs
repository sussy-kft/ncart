using System.ComponentModel.DataAnnotations;
using Backend.ModelDTOBases;
using Backend.Models;

namespace Backend.DTOs
{
    public class AllomasDTO : AllomasBase, IConvertible<Allomas>
    {
        public int Id { get; set; }
        [Required] public Vector2 Koord { get; set; }

        public Allomas ConvertType() => new Allomas
        {
            Id = Id,
            Nev = Nev,
            Koord = Koord
        };
    }
}
