using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("kezelok")]
    public partial class KezeloController : KulonModosithatoTablaController<Kezelo, KezeloDTO>
    {
        public KezeloController(AppDbContext context) : base(context)
        {

        }

        public override IEnumerable<KezeloDTO> Get() => GetAll(context.Kezelok);

        [HttpGet("{id}")]
        public ActionResult Get(int id) => Get(context.Kezelok, id);

        public override ActionResult Post([FromBody] KezeloDTO data) => Post(context.Kezelok, data);

        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] KezeloDTO ujKezelo) => Put(
            dbSet: context.Kezelok,
            data: ujKezelo,
            updateRecord: (kezelo, ujKezelo) => {
                kezelo.Email = ujKezelo.Email;
                kezelo.Jelszo = ujKezelo.Jelszo;
                kezelo.Engedelyek = ujKezelo.Engedelyek;
            },
            pk: id
        );

        [HttpPatch("{id}")]
        public ActionResult Patch(int id, [FromBody] KezeloPatchDTO ujKezelo) => Patch(
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

        public override ActionResult Delete() => DeleteAll(context.Kezelok);

        [HttpDelete("{id}")]
        public ActionResult Delete(int id) => Delete(context.Kezelok, id);
    }

    public enum Engedelyek
    {
        SzerkesztokFelvetele = 1,
        JaratokSzerkesztese = 1 << 1
    }

    public partial class KezeloController
    {
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
