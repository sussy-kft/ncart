using Backend.Models;
using Backend.ModelDTOBases;

namespace Backend.DTOs
{
    public class VonalDTO : VonalBase, IConvertible<Vonal>
    {
        public int Id { get; set; }

        public Vonal ConvertType() => new Vonal {
            Id = Id,
            VonalSzam = VonalSzam,
            JarmuTipus = JarmuTipus,
            KezdoAll = KezdoAll,
            Vegall = Vegall
        };
    }
}
