export default class Error {
    constructor(error, parent) {
        parent.html(error.message);
    }
}
