using System.ComponentModel.DataAnnotations;

namespace Backend.ModelDTOBases
{
    public abstract class KezeloBase
    {
        [Required, EmailAddress] public string Email { get; set; }
    }
}
