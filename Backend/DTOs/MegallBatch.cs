using Backend.ModelDTOBases;
using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class MegallBatch : IConvertible<List<Megall>>
    {
        [Required] public int Vonal { get; set; }

        [Required] public List<MegallBatchElem> Megallok { get; set; }

        public List<Megall> ConvertType()
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
