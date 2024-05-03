using System.ComponentModel.DataAnnotations;
using Backend.ModelDTOBases;
using Backend.Models;

namespace Backend.DTOs
{
    public class InditasDTO : InditasBase, IConvertible<Inditas>
    {
        [Required] public int Vonal { get; set; }
        [Required] public byte Nap { get; set; }
        [Required] public short InditasIdeje { get; set; }

        public Inditas ConvertType() => new Inditas {
            Vonal = Vonal,
            Nap = Nap,
            InditasIdeje = InditasIdeje
        };
    }
}
