using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public enum Engedelyek
    {
        SzerkesztokFelvetele = 1,
        JaratokSzerkesztese = 1 << 1
    }

    public class KezeloNyersEngedelyekkel
    {
        public int Id { get; set; }
        [Required, EmailAddress] public string Email { get; set; }
        [Required] public string Jelszo { get; set; }
        
        [Required] public List<string> Engedelyek { get; set; }

        static readonly Engedelyek[] engedelyek = Enum.GetValues<Engedelyek>();

        public static implicit operator Kezelo(KezeloNyersEngedelyekkel kezeloNyersEngedelyekkel) => new Kezelo {
            Id = kezeloNyersEngedelyekkel.Id,
            Email = kezeloNyersEngedelyekkel.Email,
            Jelszo = kezeloNyersEngedelyekkel.Jelszo,
            Engedelyek = ((Func<byte>)(() => {
                byte engedelyek = 0;
                ((Func<List<Engedelyek>>)(() => {
                    List<Engedelyek> engedelyek = new List<Engedelyek>();
                    kezeloNyersEngedelyekkel.Engedelyek.ForEach(engedely =>
                    {
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

                        }
                    });
                    return engedelyek;
                }))().ForEach(engedely => {
                    engedelyek |= (byte)engedely;
                });
                return engedelyek;
            }))()
        };

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

        public static implicit operator KezeloNyersEngedelyekkel(Kezelo kezelo) => new KezeloNyersEngedelyekkel {
            Id = kezelo.Id,
            Email = kezelo.Email,
            Jelszo = kezelo.Jelszo,
            Engedelyek = ((Func<List<string>>)(() => {
                List<string> engedelyek = new List<string>();
                foreach (Engedelyek engedely in KezeloNyersEngedelyekkel.engedelyek)
                {
                    if ((kezelo.Engedelyek & (byte)engedely) != 0)
                    {
                        engedelyek.Add(engedely.ToString());
                    }
                }
                return engedelyek;
            }))()
        };
    }
}
