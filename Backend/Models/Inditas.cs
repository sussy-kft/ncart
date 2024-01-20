using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Backend.ModelDTOBases;
using Backend.DTOs;

namespace Backend.Models
{
    [PrimaryKey(nameof(Vonal), nameof(Nap), nameof(InditasIdeje))]
    public class Inditas : InditasBase, IDbModel<InditasDTO>
    {
        public int Vonal { get; set; }
        public byte Nap { get; set; }
        public short InditasIdeje { get; set; }

        [ForeignKey(nameof(Vonal))] public Vonal _Vonal { get; set; }

        public InditasDTO ToDTO() => new InditasDTO {
            Vonal = Vonal,
            Nap = Nap,
            InditasIdeje = InditasIdeje
        };
    }
}
