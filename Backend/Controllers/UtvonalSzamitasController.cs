using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Diagnostics.Eventing.Reader;
using System.Text.Json.Nodes;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Backend.Controllers
{
    [ApiController, Route("dQw4w9WgXcQ")]
    public class UtvonalSzamitasController : ControllerBase
    {
        private AppDbContext context { get; }

        public UtvonalSzamitasController(AppDbContext context)
        {
            this.context = context;
        }

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

            var vonalak = context.Vonalak
               .Where(x => !tervezesiFeltetelek.vonalKivetel.Contains(x.VonalSzam))
               .Where(x => !tervezesiFeltetelek.jarmuKivetel.Contains(x.JarmuTipus))
               .ToArray();
            var megallok = context.Megallok
                .Where(x => vonalak.Contains(x._Vonal)).ToArray();
            var inditasok = context.Inditasok.Select(x => x)
                .Where(x => vonalak.Contains(x._Vonal))
                .Where(x => tervezesiFeltetelek.indulas_e
                            ? x.InditasIdeje < tervezesiFeltetelek.mikor
                            : x.InditasIdeje >= tervezesiFeltetelek.mikor)
                .ToArray();

            List<Megall> a = megallok.Where(x => x.ElozoMegallo == tervezesiFeltetelek.honnan).ToList();
            List<Megall> b = megallok.Where(x => x.Allomas == tervezesiFeltetelek.hova).ToList();
            List<Csomopont> csomopontok = new List<Csomopont>();

            int[] bV = b.Select(x => x.Vonal).ToArray();

            bool van = false;

            if (tervezesiFeltetelek.honnan == tervezesiFeltetelek.hova)
                return Ok(a[0]);

            foreach (var item in bV)
            {
                if (a.Select(x => x.Vonal).Contains(item))
                {
                    var adfg = a.Select(x => x.Vonal).Contains(item);
                    return Ok(item);
                }
            }


            List<int> tmp =a.Select(x=>x.Vonal).ToList();
            
            a = megallok.Where(x=> tmp.Contains(x.Vonal)).ToList();

            foreach (var item in a)
            {
                csomopontok.Add(new Csomopont(null, item));
            }

            while (!van)
            {
                for (int ix = 0; ix < csomopontok.Count; ix++)
                {
                    List<Megall> masikpont = megallok.Where(x => x.ElozoMegallo == csomopontok[ix].megallo.Allomas && x.Vonal != csomopontok[ix].megallo.Vonal).ToList();
                    a = new List<Megall>();
                    foreach (var item in masikpont)
                    {
                        var fdsjhkl = megallok.Where(x => item.Vonal == x.Vonal).ToList();
                        a = a.Concat(fdsjhkl).ToList();
                    }
                    
                    foreach (var item2 in a)
                    {
                        Csomopont csomopont = new Csomopont(csomopontok[ix], item2);
                        if (!csomopont.ismetlodes(csomopont.megallo))
                            csomopontok.Add(csomopont);

                        if (bV.Contains(csomopont.megallo.Vonal))
                        {
                            var a46t35 = csomopont.utvonal();
                            //List<Valasz> valasz= new List<Valasz>();
                            //foreach (var item3 in a46t35)
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
                            return Ok();
                        }

                    }


                }
            }
            return Ok();
        }
    }

    class Csomopont
    {
        public Csomopont elozoCsomopont { get; set; }
        public Megall megallo {  get; set; }

        public Csomopont(Csomopont csomopont, Megall megallo)
        {
            elozoCsomopont = csomopont;
            this.megallo = megallo;
        }

        public List<Megall> utvonal()
        {
            if (elozoCsomopont == null)
                return [megallo];
            var tmp = elozoCsomopont.utvonal();
            tmp.Add(megallo);
            return tmp;
        }

        public bool ismetlodes(Megall megallo)
        {
            if(elozoCsomopont == null)
                return false;
            if (elozoCsomopont.megallo.Equals(megallo))
                return true;
            else return elozoCsomopont.ismetlodes(megallo);
        }
    }
    
    class Valasz
    {
        public string vonal {  get; set; }
        public List<Megall> megallok { get; set; }
        public short ido { get; set; }
        public short indilasiIdo {  get; set; }

        public Valasz(string vonal)
        {
            this.vonal = vonal;
            megallok = new List<Megall>();
            ido = 0;
            indilasiIdo = 0;
        }
    }
}
