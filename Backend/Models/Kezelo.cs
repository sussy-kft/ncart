using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    [Index(nameof(Email), IsUnique = true)]
    public class Kezelo
    {
        [Key] public int Id { get; set; }
        [Required, EmailAddress] public string Email { get; set; }
        [Required, PersonalData] public string Jelszo { get; set; }
        [Required] public byte Engedelyek { get; set; }
    }
}
