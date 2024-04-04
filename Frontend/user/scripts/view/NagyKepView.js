class NagyKep {
    #kep;
    constructor(kep, szuloElem) {
        this.#kep = kep;
        this.szuloElem = szuloElem;
        this.#htmlOsszerak();
        this.jobbGomb = $("#jobb");
        this.balGomb = $("#bal");
        this.negyKepHely = $("#nagyKepHelye");

        this.felirat = $(".card-footer").children("p");

        this.cim = $(".card-header").children("h1");

        console.log(this.felirat.text());
        this.jobbGomb.on("click", () => {
            this.#sajatEsemenyKezelo("jobb");
        });
        this.balGomb.on("click", () => {
            this.#sajatEsemenyKezelo("bal");
        });
    }
    #sajatEsemenyKezelo(esemenyNev) {
        console.log(esemenyNev);
        const esemenyem = new CustomEvent(esemenyNev);
        window.dispatchEvent(esemenyem);
    }
    nagyKepCsere(kep) {
        this.negyKepHely.attr("src", kep);
    }
    feliratCsere(felirat) {
        this.felirat.text(`${felirat}`);
    }
    cimCsere(cim) {
        this.cim.text(`${cim}`);
    }

    #htmlOsszerak() {
        let txt = "";
        txt += `
          <div class="card">
          <div class="card-header text-center"><h1>Főcím</h1></div>
          <div class="card-body text-center">
          <button type="button" class="btn btn-primary" id="bal">←</button>
          <img id="nagyKepHelye"src="${
              this.#kep
          }" class="img-thumbnail" alt="Cinque Terre">
          <button type="button" class="btn btn-primary" id="jobb">→</button>
          </div>
          <div class="card-footer"><p>Leírás</p></div>
          </div>
        `;
        this.szuloElem.html(txt);
    }
}
export default NagyKep;
