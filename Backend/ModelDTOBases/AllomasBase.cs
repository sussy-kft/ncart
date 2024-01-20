using System.ComponentModel.DataAnnotations;

namespace Backend.ModelDTOBases
{
    public class AllomasBase
    {
        [Required, MaxLength(64)] public string Nev { get; set; }
    }
}
