using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    [Route("inditasok")]
    public partial class InditasController(AppDbContext context) : BatchPostableController<(int vonal, byte nap, short inditasIdeje), Inditas, InditasDTO, InditasController.InditasBatch>(context)
    {
        public override IEnumerable<InditasDTO> Get() => GetAll(context.Inditasok);

        [HttpGet("{vonal}/{nap}/{inditasIdeje}")]
        public override ActionResult Get([FromRoute] (int vonal, byte nap, short inditasIdeje) pk) => Status405;

        public override ActionResult Post([FromBody] InditasDTO data) => Post(context.Inditasok, data);

        [HttpPut("{vonal}/{nap}/{inditasIdeje}")]
        public override ActionResult Put([FromRoute] (int vonal, byte nap, short inditasIdeje) pk, [FromBody] InditasDTO data) => Status405;

        public override ActionResult Delete() => DeleteAll(context.Inditasok);

        [HttpDelete("{vonal}/{nap}/{inditasIdeje}")]
        public override ActionResult Delete([FromRoute] (int vonal, byte nap, short inditasIdeje) pk) => Delete(context.Inditasok, pk.vonal, pk.nap, pk.inditasIdeje);
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
}
