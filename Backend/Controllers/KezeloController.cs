using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("kezelok")]
    public partial class KezeloController : TablaController<int, Kezelo, KezeloDTO>
    {
        public KezeloController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<KezeloDTO> Get() => GetAll(context.Kezelok);

        public override ActionResult Post([FromBody] KezeloDTO data) => Post(context.Kezelok, data);

        public override ActionResult Delete() => DeleteAll(context.Kezelok);

        [HttpDelete("{id}")]
        public override ActionResult Delete([FromRoute] int id) => Delete(context.Kezelok, id);
    }

    public partial class KezeloController
    {
        [HttpGet("{id}")]
        public override ActionResult Get([FromRoute] int id) => Get(context.Kezelok, id);
    }

    public partial class KezeloController
    {
        [HttpPut("{id}")]
        public override ActionResult Put([FromRoute] int id, [FromBody] KezeloDTO ujKezelo) => Put(
            dbSet: context.Kezelok,
            data: ujKezelo,
            updateRecord: (kezelo, ujKezelo) => {
                kezelo.Email = ujKezelo.Email;
                kezelo.Jelszo = ujKezelo.Jelszo;
                kezelo.Engedelyek = ujKezelo.Engedelyek;
            },
            pk: id
        );
    }

    public partial class KezeloController : IPatchableIdentityPkTablaController<KezeloController.KezeloPatch>
    {
        [HttpPatch("{id}")]
        public ActionResult Patch([FromRoute] int id, [FromBody] KezeloPatch ujKezelo) => Patch(
            dbSet: context.Kezelok,
            updateRecord: record => {
                CheckIfNotNull(ujKezelo.Email, email => {
                    record.Email = email;
                });
                CheckIfNotNull(ujKezelo.Jelszo, jelszo => {
                    record.Jelszo = jelszo;
                });
                CheckIfNotNull(ujKezelo.Engedelyek, engedelyek => {
                    record.Engedelyek = ConvertEngedelyekStringListToByte(engedelyek);
                });
            },
            pk: id
        );

        public class KezeloPatch
        {
            [EmailAddress] public string? Email { get; set; }
            [PersonalData] public string? Jelszo { get; set; }

            public List<string>? Engedelyek { get; set; }
        }
    }

    public partial class KezeloController
    {
        public enum Engedelyek
        {
            SzerkesztokFelvetele = 1,
            JaratokSzerkesztese = 1 << 1
        }

        static IReadOnlyList<string> OsszesEngedelyNev { get; }

        public static IReadOnlyList<Engedelyek> OsszesEngedely { get; }

        static KezeloController()
        {
            OsszesEngedely = Enum.GetValues<Engedelyek>();
            OsszesEngedelyNev = OsszesEngedely.ToList().ConvertAll(engedely => engedely.ToString());
        }

        [HttpGet("engedelyek")]
        public IEnumerable<string> GetEngedelyek() => OsszesEngedelyNev;

        public static byte ConvertEngedelyekStringListToByte(List<string> engedelyekStringList)
        {
            byte engedelyek = 0;
            engedelyekStringList.ForEach(engedely => {
                try
                {
                    if (Enum.TryParse(engedely, out Engedelyek result))
                    {
                        engedelyek |= (byte)result;
                    }
                }
                catch (InvalidOperationException e)
                {
                    // TODO: le lehetne menteni ezeknek az exception-öknek a message-eit egy txt-be
                }
                catch (ArgumentException e)
                {
                    /* +----------+----------+
                     * |          |          |
                     * |   |      |   |      |
                     * |   |      |   |  |   |
                     * |   |      |   |  |   |
                     * +----------+----------+
                     * |          |          |
                     * |   |  |   |   |      |
                     * |   |  |   |   |      |
                     * |   |  |   |   | ____ |
                     * +----------+----------+
                     */
                }
            });
            return engedelyek;
        }
    }
}
