using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [PrimaryKey(nameof(Vonal), nameof(Allomas))]
    public class Megall
    {
        [Required] public int Vonal { get; set; }
        [Required] public int Allomas { get; set; }
        [Required] public int ElozoMegallo { get; set; }
        [Required] public byte HanyPerc { get; set; }

        [ForeignKey(nameof(Vonal))] public Vonal _Vonal { get; set; }
        [ForeignKey(nameof(Allomas))] public Allomas _Allomas { get; set; }
    }
}
