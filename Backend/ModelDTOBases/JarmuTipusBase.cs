using System.ComponentModel.DataAnnotations;

namespace Backend.ModelDTOBases
{
    public class JarmuTipusBase
    {
        [Required, MaxLength(16)] public string Megnevezes { get; set; }
    }
}
