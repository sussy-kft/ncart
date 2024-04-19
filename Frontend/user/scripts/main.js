function myFunction() {
    var x = $("#myTopnav");
    if (x.attr("class") === "topnav") {
        x.addClass("responsive");
    } else {
        x.removeClass("responsive");
        x.addClass("topnav");
    }
}
function togglePanel() {
    var panel = document.getElementById("panel");
    var toggleButtonIcon = document.getElementById("panelToggleButtonIcon");

    if (panel.style.left === "0px") {
        panel.style.left = "-540px"; // Elrejtés balra
        toggleButtonIcon.className = "bi bi-chevron-left"; // Nyíl balra
    } else {
        panel.style.left = "0px"; // Megjelenítés
        toggleButtonIcon.className = "bi bi-chevron-right"; // Nyíl jobbra
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("click", function(event) {
        console.log("X koordináta: " + event.clientX + ", Y koordináta: " + event.clientY);
    });
});
