using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class JarmuTipus
    {
        [Key] public int Id { get; set; }
        [Required, MaxLength(16)] public string Megnevezes { get; set; }

        public List<Vonal> _Vonalak { get; set; }
    }
}
