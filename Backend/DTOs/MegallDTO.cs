using Backend.ModelDTOBases;
using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class MegallDTO : MegallBase, IDataTransferObject<Megall>
    {
        [Required] public int Vonal { get; set; }
        [Required] public int Allomas { get; set; }

        public Megall ToDbModel() => new Megall {
            Vonal = Vonal,
            Allomas = Allomas,
            ElozoMegallo = ElozoMegallo,
            HanyPerc = HanyPerc
        };
    }
}
