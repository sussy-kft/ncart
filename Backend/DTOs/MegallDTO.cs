using System.ComponentModel.DataAnnotations;
using Backend.ModelDTOBases;
using Backend.Models;

namespace Backend.DTOs
{
    public class MegallDTO : MegallBase, IConvertible<Megall>
    {
        [Required] public int Vonal { get; set; }
        [Required] public int Allomas { get; set; }

        public Megall ConvertType() => new Megall {
            Vonal = Vonal,
            Allomas = Allomas,
            ElozoMegallo = ElozoMegallo,
            HanyPerc = HanyPerc
        };
    }
}
