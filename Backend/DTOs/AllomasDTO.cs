using System.ComponentModel.DataAnnotations;
using Backend.ModelDTOBases;
using Backend.Models;

namespace Backend.DTOs
{
    public class AllomasDTO : AllomasBase, IConvertible<Allomas>
    {
        public int Id { get; set; }
        [Required] public Vector2 Koord { get; set; }

        public Allomas ConvertType() => new Allomas {
            Id = Id,
            Nev = Nev,
            Koord = Koord
        };

        public class Vector2
        {
            [Required] public float X { get; set; }
            [Required] public float Y { get; set; }

            public static unsafe implicit operator Vector2(long num)
            {
                const long xComparator = ~0L << 32;
                const long yComparator = ~0L >> 32;
                int xAsInt = (int)((num & xComparator) >> 32);
                int yAsInt = (int)(num & yComparator);
                return new Vector2 {
                    X = *(float*)&xAsInt,
                    Y = *(float*)&yAsInt
                };
            }

            // haha, unsafe code go brrr

            public static unsafe implicit operator long(Vector2 vector2)
            {
                float x = vector2.X;
                float y = vector2.Y;
                return (long)*(uint*)&x << 32 | *(uint*)&y;
            }
        }
    }
}
