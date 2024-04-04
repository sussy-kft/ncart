class KisKepView {
    #kep;
    #index;
    constructor(kep, szuloElem, index) {
        this.#index = index;
        this.#kep = kep;
        this.szuloElem = szuloElem;
        this.#htmlEgyKep();

        this.kicsikep = $(".Pimg:last-child");
        this.kicsikep.on("click", () => {
            this.eleres = this.kicsikep.children("img").attr("src");
            this.#sajatEsemenyKezelo("KicsiNagyCsere");
        });
    }
    #sajatEsemenyKezelo(esemenyNev) {
        const esemenyem = new CustomEvent(esemenyNev, {
            detail: {eleres: this.eleres, index: this.#index},
        });
        window.dispatchEvent(esemenyem);
    }
    #htmlEgyKep() {
        let txt = "";
        txt += `
          <div class="Pimg card-body text-center">
          <img id="${this.#index}" src="${
            this.#kep
        }" class="img-thumbnail" alt="Cinque Terre">
          </div>
        `;
        this.szuloElem.append(txt);
    }
}
export default KisKepView;
