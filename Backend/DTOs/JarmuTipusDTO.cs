using Backend.ModelDTOBases;
using Backend.Models;

namespace Backend.DTOs
{
    public class JarmuTipusDTO : JarmuTipusBase, IDataTransferObject<JarmuTipus>
    {
        public int Id { get; set; }

        public JarmuTipus ToDbModel() => new JarmuTipus {
            Id = Id,
            Megnevezes = Megnevezes
        };
    }
}
