using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Backend.DTOs
{
    public class KezeloPatchDTO
    {
        [EmailAddress] public string? Email { get; set; }
        [PersonalData] public string? Jelszo { get; set; }

        public List<string>? Engedelyek { get; set; }
    }
}
