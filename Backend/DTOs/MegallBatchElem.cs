using System.ComponentModel.DataAnnotations;
using Backend.ModelDTOBases;

namespace Backend.DTOs
{
    public class MegallBatchElem : MegallBase
    {
        [Required] public int Allomas { get; set; }
    }
}
