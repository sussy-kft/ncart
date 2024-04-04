export default class PublicView {
    #list;
    constructor(list, parent) {
        this.#list = list;
        this.display(parent);
    }

    display(parent) {
        let tmp = "";
        this.#list.forEach((element, ix) => {
            tmp = `<div class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${Object.values(element)[1]}</h5>`;

            for (const key in element) {
                if (
                    Object.hasOwnProperty.call(element, key) &&
                    !(
                        key == "id" ||
                        key == "created_at" ||
                        key == "updated_at" ||
                        key == Object.keys(element)[1]
                    )
                ) {
                    tmp += `<h6 class="card-subtitle mb-2 text-body-secondary">${key}: ${element[key]}</h6>`;
                }
            }

            tmp += `<input type="button">
                </div>
            </div>`;
            parent.append(tmp);

            parent
                .children(".card:last-child")
                .children(".card-body:last-child")
                .children("input")
                .eq(0)
                .on("click", () => {
                    console.log(
                        $("input").eq(ix).attr("class").search("select")
                    );
                    if (
                        $("input").eq(ix).attr("class").search("select") != -1
                    ) {
                        this.#selectEvent(element.id);
                        this.#deleteButton($("input").eq(ix));
                    } else {
                        this.#deleteEvent(element.id);
                        this.#selectButton($("input").eq(ix));
                    }
                });
        });
    }

    buttonDefine(list) {
        this.#list.forEach((element, ix) => {
            if (list.findIndex((item) => item == element.id) != -1)
                this.#deleteButton($("input").eq(ix));
            else this.#selectButton($("input").eq(ix));
        });
    }

    #selectButton(htmlElement) {
        htmlElement.val("Select");
        htmlElement.removeClass();
        htmlElement.addClass("btn btn-primary select");
    }

    #deleteButton(htmlElement) {
        htmlElement.val("Cancel");
        htmlElement.removeClass();
        htmlElement.addClass("btn btn-danger delete");
    }

    #selectEvent(id) {
        window.dispatchEvent(new CustomEvent("select", {detail: id}));
    }

    #deleteEvent(id) {
        window.dispatchEvent(new CustomEvent("delete", {detail: id}));
    }
}
