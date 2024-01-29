using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class TervezesiFeltetelekDTO
    {
        [Required] public int honnan { get; set; }
        [Required] public int hova { get; set; }
        [Required] public short mikor { get; set; }
        [Required] public bool indulas_e { get; set; }
        public List<int> jarmuKivetel { get; set; }
        public List<string> vonalKivetel { get; set; }
    }
}
