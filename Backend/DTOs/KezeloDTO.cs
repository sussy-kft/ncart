using System.ComponentModel.DataAnnotations;
using Backend.ModelDTOBases;
using Backend.Models;
using Backend.Controllers;

namespace Backend.DTOs
{
    public class KezeloDTO : KezeloBase, IConvertible<Kezelo>
    {
        public int Id { get; set; }
        [Required] public string Jelszo { get; set; }

        [Required] public List<string> Engedelyek { get; set; }

        public Kezelo ConvertType() => new Kezelo {
            Id = Id,
            Email = Email,
            Jelszo = Jelszo,
            Engedelyek = ((Func<byte>)(() => {
                byte engedelyek = 0;
                Engedelyek.ForEach(engedely => {
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
            }))()
        };
    }
}
