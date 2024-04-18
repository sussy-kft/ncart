using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs;
using Backend.Models;
using Backend.ModelDTOBases;

namespace Backend.Controllers
{
    [Route("inditasok"), Authorize(Policy = nameof(KezeloController.Engedelyek.JaratokSzerkesztese))]
    public partial class InditasController(AppDbContext context, IConfiguration config) : BatchPuttableController<InditasController.PK, Inditas, InditasDTO, InditasController.InditasBatch>(context, config)
    {
        protected override DbSet<Inditas> dbSet => context.Inditasok;

        public class PK
        {
            public int vonal { get; set; }
            public byte nap { get; set; }
            public short inditasIdeje { get; set; }
        }

        public override IEnumerable<InditasDTO> Get() => PerformGetAll();

        [HttpGet("{vonal}/{nap}/{inditasIdeje}")]
        public override ActionResult Get([FromRoute] PK pk) => Status405;

        public override ActionResult Post([FromBody] InditasDTO data) => PerformPost(data);

        public override ActionResult Delete() => PerformDeleteAll();

        [HttpDelete("{vonal}/{nap}/{inditasIdeje}")]
        public override ActionResult Delete([FromRoute] PK pk) => PerformDelete(pk.vonal, pk.nap, pk.inditasIdeje);

        public override IEnumerable<IMetadataDTO<object>> GetMetadata() => PerformGetMetadata(nameof(AppDbContext.Inditasok));
    }

    public partial class InditasController
    {
        public override ActionResult PutBatch([FromBody] InditasBatch data) => PerformPutBatch(data);

        public class InditasBatch : IConvertible<IEnumerable<Inditas>>
        {
            [Required] public int Vonal { get; set; }
            [Required] public List<byte> Napok { get; set; }
            [Required] public List<short> InditasiIdopontok { get; set; }

            public IEnumerable<Inditas> ConvertType()
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
