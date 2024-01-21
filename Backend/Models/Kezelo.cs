using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs;
using Backend.ModelDTOBases;

namespace Backend.Models
{
    [Index(nameof(Email), IsUnique = true)]
    public class Kezelo : KezeloBase, IConvertible<KezeloDTO>
    {
        [Key] public int Id { get; set; }
        [Required, PersonalData] public string Jelszo { get; set; }
        [Required] public byte Engedelyek { get; set; }

        static readonly Engedelyek[] engedelyek = Enum.GetValues<Engedelyek>();

        public KezeloDTO ConvertType() => new KezeloDTO {
            Id = Id,
            Email = Email,
            Jelszo = Jelszo,
            Engedelyek = ((Func<List<string>>)(() => {
                List<string> engedelyek = new List<string>();
                foreach (Engedelyek engedely in Kezelo.engedelyek)
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
