using Backend.ModelDTOBases;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class MegallBatchElem : MegallBase
    {
        [Required] public int Allomas { get; set; }
    }
}
