using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [PrimaryKey(nameof(Vonal), nameof(Nap), nameof(InditasIdeje))]
    public class Inditas
    {
        [Required] public int Vonal { get; set; }
        [Required] public byte Nap { get; set; }
        [Required] public short InditasIdeje { get; set; }

        [ForeignKey(nameof(Vonal))] public Vonal _Vonal { get; set; }
    }
}
