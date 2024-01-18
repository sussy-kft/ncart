using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Vector2
    {
        [Required] public float X { get; set; }
        [Required] public float Y { get; set; }

        public static unsafe implicit operator long(Vector2 vector2)
        {
            float x = vector2.X;
            float y = vector2.Y;
            return (long)*(uint*)&x << 32 | *(uint*)&y;
        }

        // haha, unsafe code go brrr

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
    }
}
