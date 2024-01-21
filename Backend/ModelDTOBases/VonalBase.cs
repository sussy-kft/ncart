using System.ComponentModel.DataAnnotations;

namespace Backend.ModelDTOBases
{
    public abstract class VonalBase
    {
        [Required, MaxLength(4)] public string VonalSzam { get; set; }
        [Required] public int JarmuTipus { get; set; }
        [Required] public int KezdoAll { get; set; }
        [Required] public int Vegall { get; set; }
    }
}
