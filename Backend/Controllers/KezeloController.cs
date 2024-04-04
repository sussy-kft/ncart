using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("kezelok"), Authorize(Policy = SzerkesztokFelvetele)]
    public partial class KezeloController(AppDbContext context, IConfiguration config) : TablaController<int, Kezelo, KezeloDTO>(context, config)
    {
        public override IEnumerable<KezeloDTO> Get() => GetAll(context.Kezelok).ForEach(kezeloDTO => {
            kezeloDTO.Jelszo = "";
        });

        [HttpGet("{id}")]
        public override ActionResult Get([FromRoute] int id) => Get(context.Kezelok, id);

        public override ActionResult Post([FromBody] KezeloDTO data) => Post(context.Kezelok, data); // Jelszót titkosítani

        public override ActionResult Delete() => DeleteAll(context.Kezelok);

        [HttpPut("{id}")]
        public override ActionResult Put([FromRoute] int id, [FromBody] KezeloDTO ujKezelo) => Put(
            dbSet: context.Kezelok,
            data: ujKezelo,
            updateRecord: (kezelo, ujKezelo) => {
                kezelo.Email = ujKezelo.Email;
                kezelo.Jelszo = ujKezelo.Jelszo; // TODO: titkosítani
                kezelo.Engedelyek = ujKezelo.Engedelyek;
            },
            pk: id
        );

        [HttpDelete("{id}")]
        public override ActionResult Delete([FromRoute] int id) => Delete(context.Kezelok, id);

        public override IEnumerable<IMetadataDTO<object>> Metadata() => Metadata("Kezelok")
            .OverrideReferences(metadataDTO => metadataDTO.ColumnName == "Engedelyek", _ => "Kezelok/Engedelyek")
            .OverrideSetIsHiddenTrue(metadataDTO => metadataDTO.ColumnName == "Jelszo")
            .OverrideDataType(metadataDTO => metadataDTO.ColumnName == "Engedelyek", _ => "nvarchar[]")
            .OverrideDataType(metadataDTO => metadataDTO.ColumnName == "Email", _ => "email")
            .OverrideDataType(metadataDTO => metadataDTO.ColumnName == "Jelszo", _ => "password")
        ;
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

        public const string SzerkesztokFelvetele = "SzerkesztokFelvetele";
        public const string JaratokSzerkesztese = "JaratokSzerkesztese";

        public static IReadOnlyList<string> OsszesEngedelyNev { get; }

        public static IReadOnlyList<Engedelyek> OsszesEngedely { get; }

        static KezeloController()
        {
            OsszesEngedely = Enum.GetValues<Engedelyek>();
            OsszesEngedelyNev = OsszesEngedely.ToList().ConvertAll(engedely => engedely.ToString());
        }

        [HttpGet("engedelyek"), AllowAnonymous]
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

    public partial class KezeloController
    {
        [HttpPost("login"), AllowAnonymous]
        public ActionResult Login(LoginData loginData) => CheckIfBadRequest(() => {
            Kezelo? user = context
                .Kezelok
                .Where(kezelo => kezelo.Email == loginData.Email)
                .FirstOrDefault()
            ;
            if (user is not null && user.Jelszo == loginData.Password) // TODO: a titkosított jelszót kell lecsekkolni
            {
                JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
                return Ok(tokenHandler.WriteToken(tokenHandler.CreateToken(new SecurityTokenDescriptor {
                    Subject = new ClaimsIdentity(((Func<IEnumerable<Claim>>)(() => {
                        List<Claim> claims = [];
                        OsszesEngedelyNev.ToList().ForEach(engedelyNev => {
                            if ((user.Engedelyek & (Enum.TryParse(engedelyNev, out Engedelyek engedely) ? (int)engedely : 0)) != 0)
                            {
                                claims.Add(new Claim(engedelyNev, "true"));
                            }
                        });
                        return claims;
                    }))()),
                    Expires = DateTime.UtcNow.AddHours(1),
                    Issuer = config["Jwt:Issuer"]!,
                    Audience = config["Jwt:Audience"]!,
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(config["Jwt:Key"]!)), SecurityAlgorithms.HmacSha256Signature)
                })));
            }
            else
            {
                return BadRequest("A felhasználó email, vagy jelszó helytelen!");
            }
        });

        public class LoginData
        {
            [Required] public string Email { get; set; }
            [Required] public string Password { get; set; }
        }
    }
}
