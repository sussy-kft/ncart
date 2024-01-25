using System.ComponentModel.DataAnnotations;
using Backend.ModelDTOBases;
using Backend.Models;

namespace Backend.DTOs
{
    public class InditasBatchDTO : IConvertible<IReadOnlyList<Inditas>>
    {
        [Required] public int Vonal { get; set; }
        [Required] public List<byte> Napok { get; set; }
        [Required] public List<short> InditasiIdopontok { get; set; }

        public IReadOnlyList<Inditas> ConvertType()
        {
            List<Inditas> inditasok = new List<Inditas>();
            Napok.ForEach(nap => {
                InditasiIdopontok.ForEach(inditasIdeje => {
                    inditasok.Add(new Inditas {
                        Vonal = Vonal,
                        Nap = nap,
                        InditasIdeje = inditasIdeje
                    });
                });
            });
            return inditasok;
        }
    }
}
