using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Vonal
    {
        [Key] public int Id { get; set; }
        [Required, MaxLength(4)] public string VonalSzam { get; set; }
        [Required] public int JarmuTipus { get; set; }
        [Required] public int KezdoAll { get; set; }
        [Required] public int Vegall { get; set; }

        [ForeignKey(nameof(JarmuTipus))] public JarmuTipus _JarmuTipus { get; set; }
        [ForeignKey(nameof(KezdoAll))] public Allomas _KezdoAll { get; set; }
        [ForeignKey(nameof(Vegall))] public Allomas _Vegall { get; set; }

        public List<Inditas> _Inditasok { get; set; }
        public List<Megall> _Megallok { get; set; }
    }
}
