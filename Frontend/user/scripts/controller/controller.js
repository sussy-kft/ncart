import Model from "../model/model.js";
import KisKepek from "../view/KisKepek.js";
import NagyKep from "../view/NagyKep.js";

class Controller {
    constructor() {
        const MODEL = new Model(0);
        const NAGY_KEP = new NagyKep($("#nagyKep"), MODEL.aktualisKep());
        const KIS_KEPEK = new KisKepek($("#kisKep"), MODEL.kepLista);
        $(window).on("balra", (event) => {
            MODEL.balra();
            NAGY_KEP.nagyKepCsere(MODEL.aktualisKep());
        });
        $(window).on("jobbra", (event) => {
            MODEL.jobbra();
            NAGY_KEP.nagyKepCsere(MODEL.aktualisKep());
        });
        $(window).on("kisKepreKattintottEvent", (event) => {
            MODEL.id = event.detail.index;
            NAGY_KEP.nagyKepCsere(MODEL.aktualisKep());
        });
    }
}

export default Controller;
