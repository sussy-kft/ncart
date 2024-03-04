using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    [Route("inditasok")]
    public partial class InditasController(AppDbContext context) : BatchPostableController<InditasController.PK, Inditas, InditasDTO, InditasController.InditasBatch>(context)
    {
        public class PK
        {
            public int vonal { get; set; }
            public byte nap { get; set; }
            public short inditasIdeje { get; set; }
        }

        public override IEnumerable<InditasDTO> Get() => GetAll(context.Inditasok);

        [HttpGet("{vonal}/{nap}/{inditasIdeje}")]
        public override ActionResult Get([FromRoute] PK pk) => Status405;

        public override ActionResult Post([FromBody] InditasDTO data) => Post(context.Inditasok, data);

        [HttpPut("{vonal}/{nap}/{inditasIdeje}")]
        public override ActionResult Put([FromRoute] PK pk, [FromBody] InditasDTO data) => Status405;

        public override ActionResult Delete() => DeleteAll(context.Inditasok);

        [HttpDelete("{vonal}/{nap}/{inditasIdeje}")]
        public override ActionResult Delete([FromRoute] PK pk) => Delete(context.Inditasok, pk.vonal, pk.nap, pk.inditasIdeje);

        public override IEnumerable<IMetadataDTO<object>> Metadata() => Metadata("Inditasok");
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
