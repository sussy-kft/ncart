using System.Security.Cryptography;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("kezelok"), Authorize(Policy = SzerkesztokFelvetele)]
    public partial class KezeloController(AppDbContext context, IConfiguration config) : TablaController<int, Kezelo, KezeloDTO>(context, config)
    {
        static HashAlgorithmName hashAlgorithmName { get; }

        const char delimiter = ';';

        const int keySize = 1 << 5;
        const int iterations = 1 << 13;

        static JwtSecurityTokenHandler tokenHandler { get; }

        static KezeloController()
        {
            hashAlgorithmName = HashAlgorithmName.SHA256;
            OsszesEngedely = Enum.GetValues<Engedelyek>();
            OsszesEngedelyNev = OsszesEngedely.ToList().ConvertAll(engedely => engedely.ToString());
            tokenHandler = new JwtSecurityTokenHandler();
        }

        public override IEnumerable<KezeloDTO> Get() => GetAll(context.Kezelok).ForEach(kezeloDTO => {
            kezeloDTO.Jelszo = "";
        });

        [HttpGet("{id}")]
        public override ActionResult Get([FromRoute] int id) => Get(context.Kezelok, id);

        /* ======================================================================================
         * 
         * !!! FONTOS !!!
         * 
         * Ahoz, hogy új szerkesztőket lehessen felvenni, az admin oldalra bejelentkezett
         * felhasználónak engedélyezve kell legyen az új szerkesztők felvétele
         * (SzerkesztokFelvetele engedély). Ha az adatbázisban nics felvéve még egy felhasználó
         * se akinek ez engedélyezve van, akkor fel kell venni egyet. Ezt nem lehet direktben az
         * adatbázisban felvenni, mert ott nem lenne letitkosítva a jelszó (ez nem csak a
         * biztonság miatt, hanem a bejelentkezéskor a jelszó validálás sem fog működni), úgyhogy
         * ezt úgy lehet megtenni, hogy az alábbi metódus feletti "[AllowAnonymous]" attribútumot
         * uncomment-ezed, majd IIS Express módban indítod a programot és a megnyíló Swagger
         * oldalon a "Kezelok" post metódusában vihetsz fel egy új felhasználót aminek megadod a
         * "SzerkesztokFelvetele" engedélyt (fontos megjegyezni a jelszót, mert az adatbázisban
         * titkosítva lesz eltárolva, úgyhogy nem fogod tudni kinézni onnan ha elfelejted). Ezt
         * megtéve leállíthatod a programot, újra kikommentezheted (kis is kell) az alábbi
         * metóduson az "[AllowAnonymous]" attribútumot, majd hagyományos módon elindíthatod a
         * programot és az újonnan felvitt felhasználóval beléphetsz az admin oldalra, ahonnan
         * már engedélyezve van az új szerkesztők felvétele.
         * 
         * ======================================================================================
         */

        //[AllowAnonymous]
        public override ActionResult Post([FromBody] KezeloDTO data) => CheckIfBadRequest(() => {
            Kezelo kezelo = data.ConvertType();
            kezelo.Jelszo = EncryptPassword(kezelo.Jelszo);
            return TrySaveRecord(kezelo, record => {
                context.Kezelok.Add(record);
            });
        });

        public override ActionResult Delete() => DeleteAll(context.Kezelok);

        [HttpPut("{id}")]
        public override ActionResult Put([FromRoute] int id, [FromBody] KezeloDTO ujKezelo) => Put(
            dbSet: context.Kezelok,
            data: ujKezelo,
            updateRecord: (kezelo, ujKezelo) => {
                kezelo.Email = ujKezelo.Email;
                kezelo.Jelszo = EncryptPassword(ujKezelo.Jelszo);
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

        static string EncryptPassword(string password)
        {
            const int saltSize = 1 << 4;
            byte[] salt = RandomNumberGenerator.GetBytes(saltSize);
            return string.Join(delimiter, Convert.ToBase64String(salt), Convert.ToBase64String(Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, hashAlgorithmName, keySize)));
        }
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
                    record.Jelszo = EncryptPassword(jelszo);
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
            if (user is not null && ((Func<bool>)(() => {
                string[] elements = user.Jelszo.Split(delimiter);
                return CryptographicOperations.FixedTimeEquals(Convert.FromBase64String(elements[1]), Rfc2898DeriveBytes.Pbkdf2(loginData.Password, Convert.FromBase64String(elements[0]), iterations, hashAlgorithmName, keySize));
            }))())
            {
                DateTime lejaratiIdopont = DateTime.UtcNow.AddHours(1);
                return Ok(new TokenData {
                    Token = tokenHandler.WriteToken(tokenHandler.CreateToken(new SecurityTokenDescriptor {
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
                        Expires = lejaratiIdopont,
                        Issuer = config["Jwt:Issuer"]!,
                        Audience = config["Jwt:Audience"]!,
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(config["Jwt:Key"]!)), SecurityAlgorithms.HmacSha256Signature)
                    })),
                    LejaratiIdopont = lejaratiIdopont
                });
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

        public class TokenData
        {
            public string Token { get; set; }
            public DateTime LejaratiIdopont { get; set; }
        }
    }
}
