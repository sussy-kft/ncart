using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    [Route("inditasok")]
    public partial class InditasController : BatchPostableController<Inditas, InditasDTO, InditasController.InditasBatch>
    {
        public InditasController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<InditasDTO> Get() => GetAll(context.Inditasok);

        public override ActionResult Post([FromBody] InditasDTO data) => Post(context.Inditasok, data);

        public override ActionResult Delete() => DeleteAll(context.Inditasok);

        [HttpDelete("{vonal}/{nap}/{inditasIdeje}")]
        public ActionResult Delete(int vonal, byte nap, short inditasIdeje) => Delete(context.Inditasok, vonal, nap, inditasIdeje);
    }

    public partial class InditasController
    {
        public override ActionResult Post([FromBody] InditasBatch data) => Post(context.Inditasok, data);

        public class InditasBatch : IConvertible<IReadOnlyList<Inditas>>
        {
            [Required] public int Vonal { get; set; }
            [Required] public List<byte> Napok { get; set; }
            [Required] public List<short> InditasiIdopontok { get; set; }

            public IReadOnlyList<Inditas> ConvertType()
            {
                List<Inditas> inditasok = new List<Inditas>();
                Napok.ForEach(nap => {
                    InditasiIdopontok.ForEach(inditasIdeje => {
                        inditasok.Add(new Inditas
                        {
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
}
