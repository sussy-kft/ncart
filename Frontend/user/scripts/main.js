/*
import Controller from "./controller/controller.js";
$(function () {
    new Controller();
});
*/
function myFunction() {
    var x = $("#myTopnav");
    if (x.attr("class") === "topnav") {
        x.addClass("responsive");
    } else {
        x.removeClass("responsive");
        x.addClass("topnav");
    }
}
