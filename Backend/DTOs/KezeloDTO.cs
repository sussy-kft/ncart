using System.ComponentModel.DataAnnotations;
using Backend.ModelDTOBases;
using Backend.Models;
using Backend.Controllers;

namespace Backend.DTOs
{
    public class KezeloDTO : KezeloBase, IConvertible<Kezelo>
    {
        public int Id { get; set; }
        [Required] public string Jelszo { get; set; }

        [Required] public List<string> Engedelyek { get; set; }

        public Kezelo ConvertType() => new Kezelo {
            Id = Id,
            Email = Email,
            Jelszo = Jelszo,
            Engedelyek = KezeloController.ConvertEngedelyekStringListToByte(Engedelyek)
        };
    }
}
