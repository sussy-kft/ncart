using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Linq;

namespace Backend.Controllers
{
    [Route("dQw4w9WgXcQ")]
    public class UtvonalSzamitasController(AppDbContext context, IConfiguration config) : JsonRecieverController (context, config)
    {
        Vonal[] vonalak = null;
        Megall[] megallok = null;
        Inditas[][] indulasok = null;

        [HttpPost("legrovidebb")]
        public IActionResult legrovidebb([FromBody] TervezesiFeltetelekDTO tervezesiFeltetelek)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return StatusCode(451);
        }

        [HttpPost("legkevesebb")]
        public IActionResult legkevesebb([FromBody] TervezesiFeltetelekDTO tervezesiFeltetelek)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (tervezesiFeltetelek.honnan == tervezesiFeltetelek.hova)
                return UnprocessableEntity();

            (vonalak, megallok, indulasok) = adatokLekerdezese(tervezesiFeltetelek);

            List<Megall> lehetsegesMegallok = megallok.Where(x => x.ElozoMegallo == tervezesiFeltetelek.honnan).ToList();
            List<Megall> uticelVonalak = megallok.Where(x => x.Allomas == tervezesiFeltetelek.hova).ToList();
            List<Csomopont> csomopontok = [];

            List<int> bV = uticelVonalak.Select(x => x.Vonal).ToList();
            foreach ((int kovAll, Megall kezdoAll) in bV.SelectMany(item => lehetsegesMegallok.Where(x => x.Vonal == item).Select(xd => (item, xd))))
            {
                Csomopont tmp = uticelVonalak.Contains(kezdoAll) ? new(null, kezdoAll) : new(new(null, kezdoAll), uticelVonalak.First(x => x.Vonal == kovAll));
                List<ValaszVonal>? valasz = utvonalMegallapitas(tervezesiFeltetelek, tmp);
                if (valasz is not null)
                    return Ok(valasz);
            }

            foreach (Megall? item in megallok.Where(x => lehetsegesMegallok.Select(x => x.Vonal).Contains(x.Vonal)))
                csomopontok.Add(new(lehetsegesMegallok.First(x => x.Vonal == item.Vonal) != item ? new(null, lehetsegesMegallok.First(x => x.Vonal == item.Vonal)) : null, item));

            for (int ix = 0; ix < csomopontok.Count; ix++)
            {
                lehetsegesMegallok=megallok
                    .Where(x => x.ElozoMegallo == csomopontok[ix].megallo.Allomas && x.Vonal != csomopontok[ix].megallo.Vonal)
                    .Aggregate(new List<Megall>(),(lista, elem) => [.. lista, .. megallok.Where(x => elem.Vonal == x.Vonal)]);

                foreach (Megall item in lehetsegesMegallok)
                {
                    Csomopont csomopont = new(csomopontok[ix], item);
                    if (!csomopont.ismetlodke(csomopont.megallo))
                        csomopontok.Add(csomopont);

                    if (bV.Contains(csomopont.megallo.Vonal)) 
                    {
                        List<ValaszVonal>? utvonal = utvonalMegallapitas(tervezesiFeltetelek, csomopont);
                        if(utvonal is null)
                            continue;
                        return Ok(utvonal);
                    }
                }
            }
            //how to cook lehetsegesIndulasok chicken in 10 minutes or less with 3 ingredients or less in 3 easy steps or less
            //1. Preheat the oven to 450°F.
            //2. Season the chicken with salt and pepper.
            //3. Place the chicken in lehetsegesIndulasok baking dish and bake for 10 minutes or until the chicken is cooked through
            
            return NotFound();

        }

        private List<ValaszVonal>? utvonalMegallapitas(TervezesiFeltetelekDTO tervezesiFeltetelek, Csomopont csomopont)
        {
            List<Megall> utvonal = csomopont.utvonal();
            if(!tervezesiFeltetelek.indulas_e)
                utvonal.Reverse();
            List<ValaszVonal> valasz = [];
            Megall? tmp = null;
            
            int jelenNap= 0;

            for (int ix = utvonal.Count > 1 && utvonal[0].Vonal == utvonal[1].Vonal ? 1 : 0; ix < utvonal.Count; ix++)
            {
                Megall jelenMegallo = utvonal[ix];
                ValaszVonal valaszVonal = new(jelenMegallo.Vonal);

                tmp = tmp is null
                    ? utvonal[0]
                    : megallok.Where(x => (tervezesiFeltetelek.indulas_e? x.ElozoMegallo == tmp.Allomas: x.Allomas == tmp.ElozoMegallo) && x.Vonal == jelenMegallo.Vonal).First();

                short ido = jelenMegallo.HanyPerc;
                if (valasz.Count > 1 && valasz[^1].vonal == jelenMegallo.Vonal)
                {
                    valaszVonal.megallok = valasz.Last().megallok;
                    jelenMegallo = utvonal.Last();
                    valasz.Remove(valasz.Last());
                }
                valaszVonal.megallok.Add(tervezesiFeltetelek.indulas_e ? tmp.ElozoMegallo : tmp.Allomas);
                while (tmp != jelenMegallo)
                {
                    valaszVonal.megallok.Add(tervezesiFeltetelek.indulas_e ? tmp.Allomas : tmp.ElozoMegallo);
                    ido += tmp.HanyPerc;
                    tmp = megallok.First(x => tervezesiFeltetelek.indulas_e ? x.ElozoMegallo == tmp.Allomas : x.Allomas == tmp.ElozoMegallo);
                }
                valaszVonal.megallok.Add(tervezesiFeltetelek.indulas_e ? tmp.Allomas : tmp.ElozoMegallo);
                valaszVonal.ido = ido;

                int jx = 0;
                while (jx is < 2 and > (-2))
                {
                    //2024-02-12 //2024-02-15
                    Inditas[] idopontok = indulasok[(7 + jelenNap + jx) % 7];
                    IEnumerable<Inditas> lehetsegesIndulasok = getLehetsegesIndulasok(tervezesiFeltetelek, valasz, valaszVonal, jx, idopontok);
                    if (lehetsegesIndulasok.ToList().Count > 0)
                    {
                        jelenNap = (jelenNap + jx + (valasz.Count > 0 ? ((valasz.Last().indulasiIdo + (tervezesiFeltetelek.indulas_e ? valasz.Last().ido : -valaszVonal.ido)) / 1440) : 7)) % 7;
                        valaszVonal.nap = (valasz.Count > 0 ? valasz.Last().getDateOnlyNap().AddDays(jx) : DateOnly.Parse(tervezesiFeltetelek.datum)).ToString();
                        valaszVonal.indulasiIdo = indulasiIdo(lehetsegesIndulasok, tervezesiFeltetelek.indulas_e);
                        valasz.Add(valaszVonal);
                        break;
                    }
                    jx += tervezesiFeltetelek.indulas_e ? 1 : -1;
                }
                if (jx >= 2 || jx <= -2)
                    return null;
            }
            return valasz;
        }

        private static short indulasiIdo(IEnumerable<Inditas> lehetsegesIndulasok, bool indulas_e)
        {
            return indulas_e
                ? lehetsegesIndulasok.Aggregate((min, x) => x.InditasIdeje <  min.InditasIdeje ? x : min).InditasIdeje
                : lehetsegesIndulasok.Aggregate((max, x) => x.InditasIdeje >= max.InditasIdeje ? x : max).InditasIdeje;
        }

        private static IEnumerable<Inditas> getLehetsegesIndulasok(TervezesiFeltetelekDTO tervezesiFeltetelek, List<ValaszVonal> valasz, ValaszVonal valaszVonal, int jx, Inditas[] idopontok)
        {
            return tervezesiFeltetelek.indulas_e 
                ? idopontok.Where(x => x.Vonal == valaszVonal.vonal && x.InditasIdeje > (valasz.Count < 1 ? tervezesiFeltetelek.mikor : valasz.Last().indulasiIdo + valasz.Last().ido - 1440 * jx))
                : idopontok.Where(x => x.Vonal == valaszVonal.vonal && x.InditasIdeje < (valasz.Count < 1 ? tervezesiFeltetelek.mikor : valasz.Last().indulasiIdo -   valaszVonal.ido - 1440 * jx));
        }

        private (Vonal[] vonalok, Megall[] megallok, Inditas[][] indulasok) adatokLekerdezese(TervezesiFeltetelekDTO tervezesiFeltetelek)
        {
            
            Vonal[] vonalak =
            [
                .. context.Vonalak.Where(x => !tervezesiFeltetelek.vonalKivetel.Contains(x.VonalSzam)
                                    && !tervezesiFeltetelek.jarmuKivetel.Contains(x.JarmuTipus))
            ];
            Megall[] megallok = [.. context.Megallok.Where(x => vonalak.Contains(x._Vonal))];
            return (vonalak, megallok, inditasokLekerdezese(vonalak, tervezesiFeltetelek));
        }

        private Inditas[][] inditasokLekerdezese(Vonal[] vonalak, TervezesiFeltetelekDTO tervezesiFeltetelek)
        {
            DateOnly datum = DateOnly.Parse(tervezesiFeltetelek.datum);
            Inditas[][] inditasok = new Inditas[7][];
            for (int ix = 0; ix < 7; ix++)
                inditasok[ix] = [.. context.Inditasok.Where(x => vonalak.Contains(x._Vonal) && (int)(datum.DayOfWeek + ix) % 7 == x.Nap)];
            return inditasok;
        }
    }



    class Csomopont(Csomopont? csomopont, Megall megallo)
    {
        public Csomopont? elozoCsomopont { get; set; } = csomopont;
        public Megall megallo { get; set; } = megallo;

        public List<Megall> utvonal()
        {
            return [..elozoCsomopont?.utvonal()??[] ,megallo];
        }

        public bool ismetlodke(Megall megallo)
        {
            return (elozoCsomopont?.megallo.Equals(megallo) ?? false) || (elozoCsomopont?.ismetlodke(megallo) ?? false); 
        }
    }
    
    class ValaszVonal(int vonal)
    {
        public int vonal { get; set; } = vonal;
        public List<int> megallok { get; set; } = [];
        public short ido { get; set; } = 0;
        public string nap { get; set; } = DateTime.MinValue.ToString();
        public short indulasiIdo { get; set; } = 0;
    
        public DateOnly getDateOnlyNap()
        {
            return DateOnly.Parse(nap);
        }
    }
}