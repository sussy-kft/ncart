using System.ComponentModel.DataAnnotations;
using Backend.ModelDTOBases;
using Backend.Models;

namespace Backend.DTOs
{
    public class MegallBatch : IConvertible<IReadOnlyList<Megall>>
    {
        [Required] public int Vonal { get; set; }

        [Required] public List<MegallBatchElem> Megallok { get; set; }

        public IReadOnlyList<Megall> ConvertType()
        {
            List<Megall> megallok = new List<Megall>();
            Megallok.ForEach(megall => {
                megallok.Add(new Megall {
                    Vonal = Vonal,
                    Allomas = megall.Allomas,
                    ElozoMegallo = megall.ElozoMegallo,
                    HanyPerc = megall.HanyPerc
                });
            });
            return megallok;
        }
    }
}
