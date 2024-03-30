import {KEP_LISTA} from "../model/adat.js";

class Model {
    #kepLista;
    #id;

    constructor(id) {
        this.#kepLista = KEP_LISTA;
        this.#id = id;
    }

    get kepLista() {
        return this.#kepLista;
    }

    set id(id) {
        this.#id = id % this.#kepLista.length;
    }

    aktualisKep() {
        return this.#kepLista[this.#id];
    }

    jobbra() {
        if (++this.#id >= this.#kepLista.length) {
            this.#id = 0;
        }
    }

    balra() {
        if (--this.#id < 0) {
            this.#id = this.#kepLista.length - 1;
        }
    }
}

export default Model;
