export default class PublicModel {
    #list = [];

    constructor() {
        let tmp =
            localStorage.getItem("IDs") !== null
                ? localStorage.getItem("IDs").split(",")
                : [];
        this.#list = tmp[0] === "" ? [] : tmp;
    }

    add(element) {
        this.#list.push(element);
        localStorage.setItem("IDs", this.#list.toString());
    }

    remove(element) {
        this.#list = this.#list.filter((item) => item != element);
        console.log(this.#list);
        localStorage.setItem("IDs", this.#list.toString());
    }

    get list() {
        return this.#list;
    }
}
