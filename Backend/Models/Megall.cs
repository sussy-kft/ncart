using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Backend.ModelDTOBases;
using Backend.DTOs;

namespace Backend.Models
{
    [PrimaryKey(nameof(Vonal), nameof(Allomas))]
    public class Megall : MegallBase, IDbModel<MegallDTO>
    {
        public int Vonal { get; set; }
        public int Allomas { get; set; }

        [ForeignKey(nameof(Vonal)), JsonIgnore] public Vonal _Vonal { get; set; }
        [ForeignKey(nameof(Allomas)), JsonIgnore] public Allomas _Allomas { get; set; }

        public MegallDTO ToDTO() => new MegallDTO {
            Vonal = Vonal,
            Allomas = Allomas,
            ElozoMegallo = ElozoMegallo,
            HanyPerc = HanyPerc
        };
    }
}
