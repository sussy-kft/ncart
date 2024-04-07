function myFunction() {
    var x = $("#myTopnav");
    if (x.attr("class") === "topnav") {
        x.addClass("responsive");
    } else {
        x.removeClass("responsive");
        x.addClass("topnav");
    }
}
