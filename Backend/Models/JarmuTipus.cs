using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class JarmuTipus
    {
        [Key] public int Id { get; set; }
        [Required, MaxLength(16)] public string Megnevezes { get; set; }

        [JsonIgnore] public List<Vonal> _Vonalak { get; set; }
    }
}
