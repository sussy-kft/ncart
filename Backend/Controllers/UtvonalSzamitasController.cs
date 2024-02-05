using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController, Route("dQw4w9WgXcQ")]
    public class UtvonalSzamitasController(AppDbContext context) : ControllerBase
    {
        private AppDbContext context { get; } = context;

        [HttpPost("legrovidebb")]
        public IActionResult Post([FromBody] TervezesiFeltetelekDTO tervezesiFeltetelek)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok();
        }

        [HttpDelete("legkevesebb")]
        public IActionResult legkevesebb([FromBody] TervezesiFeltetelekDTO tervezesiFeltetelek)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            (Vonal[] vonalak, Megall[] megallok, Inditas[] indulasok) = adatokLekerdezese(tervezesiFeltetelek);

            List<Megall> jelenlegiVonalak = megallok.Where(x => x.ElozoMegallo == tervezesiFeltetelek.honnan).ToList();
            List<Megall> uticelVonalak = megallok.Where(x => x.Allomas == tervezesiFeltetelek.hova).ToList();
            List<Csomopont> csomopontok = [];

            List<int> bV = uticelVonalak.Select(x => x.Vonal).ToList();
            
            if (tervezesiFeltetelek.honnan == tervezesiFeltetelek.hova)
                return Ok(jelenlegiVonalak);
            

            foreach (var item in bV)
            {
                if (jelenlegiVonalak.Select(x => x.Vonal).Contains(item))
                {
                    return Ok(item);
                }
            }
            
            jelenlegiVonalak = megallok.Where(x => jelenlegiVonalak.Select(x => x.Vonal).Contains(x.Vonal)).ToList();

            jelenlegiVonalak.ForEach(item =>
            {
                csomopontok.Add(new Csomopont(null, item));
            });

            for (int ix = 0; ix < csomopontok.Count; ix++)
            {
                jelenlegiVonalak = [];
                foreach (Megall item in megallok.Where(x => x.ElozoMegallo == csomopontok[ix].megallo.Allomas && x.Vonal != csomopontok[ix].megallo.Vonal))
                {
                    jelenlegiVonalak = [.. jelenlegiVonalak, .. megallok.Where(x => item.Vonal == x.Vonal)];
                }

                foreach (Megall item in jelenlegiVonalak)
                {
                    Csomopont csomopont = new(csomopontok[ix], item);
                    if (!csomopont.ismetlodke(csomopont.megallo))
                        csomopontok.Add(csomopont);

                    if (bV.Contains(csomopont.megallo.Vonal))
                    {
                        List<Megall> utvonal = csomopont.utvonal();
                        //List<Valasz> valasz= new List<Valasz>();
                        //foreach (var item3 in utvonal)
                        //{
                        //    valasz.Add(new Valasz(item3._Vonal.VonalSzam));
                        //    Megall most = item3;
                        //    List<Megall> ut = megallok.Where(x=> x.Vonal==item3.Vonal).ToList();
                        //    short ido = most.HanyPerc;

                        //    valasz.Last().megallok.Add(most);
                        //    while (ut.Where(x => x.Allomas == most.ElozoMegallo).Count() > 0)
                        //    {
                        //        ido += most.HanyPerc;
                        //        valasz.Last().megallok.Add(most);
                        //        most = ut.Where(x => x.Allomas == most.ElozoMegallo).FirstOrDefault();
                        //    }

                        //    valasz.Last().ido = ido;

                        //    }
                        return Ok("kys");
                    }

                }


            }
            //how to cook a chicken in 10 minutes or less with 3 ingredients or less in 3 easy steps or less
            //1. Preheat the oven to 450°F.
            //2. Season the chicken with salt and pepper.
            //3. Place the chicken in a baking dish and bake for 10 minutes or until the chicken is cooked through
            
            return NotFound();

        }

        private (Vonal[] vonalok, Megall[] megallok, Inditas[] indulasok) adatokLekerdezese(TervezesiFeltetelekDTO tervezesiFeltetelek)
        {
            var vonalak = context.Vonalak
               .Where(x => !tervezesiFeltetelek.vonalKivetel.Contains(x.VonalSzam)
                && !tervezesiFeltetelek.jarmuKivetel.Contains(x.JarmuTipus))
               .ToArray();
            var megallok = context.Megallok
                .Where(x => vonalak.Contains(x._Vonal)).ToArray();
            var inditasok = context.Inditasok.Select(x => x)
                .Where(x => vonalak.Contains(x._Vonal)
                && tervezesiFeltetelek.indulas_e
                            ? x.InditasIdeje < tervezesiFeltetelek.mikor
                            : x.InditasIdeje >= tervezesiFeltetelek.mikor)
                .ToArray();
            return (vonalak, megallok, inditasok);
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
    
    class Valasz(int vonal)
    {
        public int vonal { get; set; } = vonal;
        public List<Megall> megallok { get; set; } = [];
        public short ido { get; set; } = 0;
        public short indilasiIdo { get; set; } = 0;
    }
}
