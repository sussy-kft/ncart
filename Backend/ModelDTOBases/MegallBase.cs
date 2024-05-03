using System.ComponentModel.DataAnnotations;

namespace Backend.ModelDTOBases
{
    public abstract class MegallBase
    {
        [Required] public int ElozoMegallo { get; set; }
        [Required] public byte HanyPerc { get; set; }
    }
}
