using System.ComponentModel.DataAnnotations;

namespace Backend.ModelDTOBases
{
    public class KezeloBase
    {
        [Required, EmailAddress] public string Email { get; set; }
    }
}
