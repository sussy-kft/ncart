import DataService from "../../models/dataService.js";
import Error from "../../models/error.js";
import PublicModel from "../../models/public/publicModel.js";
import PublicView from "../../views/public/publicView.js";

export default class PublicController {
    constructor() {
        this.dataService = new DataService();
        this.model = new PublicModel();

        this.setupEventListeners();

        this.dataService.getData(
            "http://localhost:8000/api/people",
            this.display.bind(this),
            this.error.bind(this),
            this.model.list
        );
    }

    setupEventListeners() {
        $(window).on("select", (event) => this.handleSelect(event));
        $(window).on("delete", (event) => this.handleDelete(event));
    }

    handleSelect(event) {
        this.model.add(event.detail);
    }

    handleDelete(event) {
        this.model.remove(event.detail);
    }

    display = (list, args) => {
        const view = new PublicView(list, $("#card"));
        view.buttonDefine(args[3]);
    };

    error = (error) => new Error(error, $("#card"));
}
