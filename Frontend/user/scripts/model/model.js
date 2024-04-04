import {KEPLISTA} from "./data.js";
class Model {
    #lista = [];
    #id;
    constructor() {
        this.#lista = KEPLISTA;
        this.#id = 0;
    }
    getList() {
        return this.#lista;
    }
    getAktkep() {
        return this.#lista[this.#id];
    }
    getKisKepek(index) {
        return this.#lista[index].eleres;
    }
    jobb() {
        if (++this.#id >= this.#lista.length) {
            this.#id = 0;
        }
    }
    bal() {
        if (--this.#id < 0) {
            this.#id = this.#lista.length - 1;
        }
    }
}
export default Model;
