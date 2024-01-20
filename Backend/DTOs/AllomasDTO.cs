using System.ComponentModel.DataAnnotations;
using Backend.ModelDTOBases;
using Backend.Models;

namespace Backend.DTOs
{
    public class AllomasDTO : AllomasBase, IDataTransferObject<Allomas>
    {
        public int Id { get; set; }
        [Required] public Vector2 Koord { get; set; }

        public Allomas ToDbModel() => new Allomas
        {
            Id = Id,
            Nev = Nev,
            Koord = Koord
        };
    }
}
