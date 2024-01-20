using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Backend.DTOs;
using Backend.ModelDTOBases;

namespace Backend.Models
{
    public class JarmuTipus : JarmuTipusBase, IDbModel<JarmuTipusDTO>
    {
        [Key] public int Id { get; set; }

        [JsonIgnore] public List<Vonal> _Vonalak { get; set; }

        public JarmuTipusDTO ToDTO() => new JarmuTipusDTO {
            Id = Id,
            Megnevezes = Megnevezes,
        };
    }
}
