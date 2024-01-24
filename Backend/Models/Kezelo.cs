using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs;
using Backend.ModelDTOBases;
using Backend.Controllers;

namespace Backend.Models
{
    [Index(nameof(Email), IsUnique = true)]
    public class Kezelo : KezeloBase, IConvertible<KezeloDTO>
    {
        [Key] public int Id { get; set; }
        [Required, PersonalData] public string Jelszo { get; set; }
        [Required] public byte Engedelyek { get; set; }

        public KezeloDTO ConvertType() => new KezeloDTO {
            Id = Id,
            Email = Email,
            Jelszo = Jelszo,
            Engedelyek = ((Func<List<string>>)(() => {
                List<string> engedelyek = new List<string>();
                foreach (Engedelyek engedely in KezeloController.OsszesEngedely)
                {
                    if ((Engedelyek & (byte)engedely) != 0)
                    {
                        engedelyek.Add(engedely.ToString());
                    }
                }
                return engedelyek;
            }))()
        };
    }
}
