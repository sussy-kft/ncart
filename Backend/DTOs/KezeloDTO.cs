using System.ComponentModel.DataAnnotations;
using Backend.ModelDTOBases;
using Backend.Models;

namespace Backend.DTOs
{
    public enum Engedelyek
    {
        SzerkesztokFelvetele = 1,
        JaratokSzerkesztese = 1 << 1
    }

    public class KezeloDTO : KezeloBase, IDataTransferObject<Kezelo>
    {
        public int Id { get; set; }
        [Required] public string Jelszo { get; set; }

        [Required] public List<string> Engedelyek { get; set; }

        public Kezelo ToDbModel() => new Kezelo {
            Id = Id,
            Email = Email,
            Jelszo = Jelszo,
            Engedelyek = ((Func<byte>)(() => {
                byte engedelyek = 0;
                ((Func<List<Engedelyek>>)(() => {
                    List<Engedelyek> engedelyek = new List<Engedelyek>();
                    Engedelyek.ForEach(engedely => {
                        try
                        {
                            if (Enum.TryParse(engedely, out Engedelyek result))
                            {
                                engedelyek.Add(result);
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
                }))().ForEach(engedely => {
                    engedelyek |= (byte)engedely;
                });
                return engedelyek;
            }))()
        };
    }
}
