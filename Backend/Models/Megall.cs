using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Backend.ModelDTOBases;
using Backend.DTOs;

namespace Backend.Models
{
    [PrimaryKey(nameof(Vonal), nameof(Allomas))]
    public class Megall : MegallBase, IConvertible<MegallDTO>
    {
        public int Vonal { get; set; }
        public int Allomas { get; set; }

        [ForeignKey(nameof(Vonal))] public Vonal _Vonal { get; set; }
        [ForeignKey(nameof(Allomas))] public Allomas _Allomas { get; set; }

        public MegallDTO ConvertType() => new MegallDTO {
            Vonal = Vonal,
            Allomas = Allomas,
            ElozoMegallo = ElozoMegallo,
            HanyPerc = HanyPerc
        };
    }
}
