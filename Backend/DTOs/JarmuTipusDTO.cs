using Backend.ModelDTOBases;
using Backend.Models;

namespace Backend.DTOs
{
    public class JarmuTipusDTO : JarmuTipusBase, IConvertible<JarmuTipus>
    {
        public int Id { get; set; }

        public JarmuTipus ConvertType() => new JarmuTipus {
            Id = Id,
            Megnevezes = Megnevezes
        };
    }
}
