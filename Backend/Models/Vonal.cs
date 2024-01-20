using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Backend.DTOs;
using Backend.ModelDTOBases;

namespace Backend.Models
{
    public class Vonal : VonalBase, IDbModel<VonalDTO>
    {
        [Key] public int Id { get; set; }

        [ForeignKey(nameof(JarmuTipus)), JsonIgnore] public JarmuTipus _JarmuTipus { get; set; }
        [ForeignKey(nameof(KezdoAll)), JsonIgnore] public Allomas _KezdoAll { get; set; }
        [ForeignKey(nameof(Vegall)), JsonIgnore] public Allomas _Vegall { get; set; }

        [JsonIgnore] public List<Inditas> _Inditasok { get; set; }
        [JsonIgnore] public List<Megall> _Megallok { get; set; }

        public VonalDTO ToDTO() => new VonalDTO {
            Id = Id,
            VonalSzam = VonalSzam,
            JarmuTipus = JarmuTipus,
            KezdoAll = KezdoAll,
            Vegall = Vegall
        };
    }
}
