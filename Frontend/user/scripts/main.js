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
        toggleButtonIcon.className = "bi bi-chevron-right"; // Nyíl jobbra
    } else {
        panel.style.left = "0px"; // Megjelenítés
        toggleButtonIcon.className = "bi bi-chevron-left"; // Nyíl balra
    }
}

$(document).ready(function () {
    var x = 0;
    var y = 94.4;
    var img = $("#map");
    var isDragging = false;

    // This will run when the mouse button is pressed within the map container
    img.on("mousedown", function (event) {
        isDragging = true;
        var offset = img.offset();
        x = event.clientX - offset.left;
        y = event.clientY - offset.top;
    });

    // This will run when the mouse button is released anywhere in the document
    $(document).on("mouseup", function (event) {
        if (isDragging) {
            isDragging = false;
        }
    });

    // This will run when the mouse is moved
    $(document).on("mousemove", function (event) {
        if (isDragging) {
            var newX = event.clientX - x;
            var newY = event.clientY - y;

            // Limiting the movement within the bounds of the map container
            var parentWidth = img.parent().width();
            var parentHeight = img.parent().height();
            var imgWidth = img.width();
            var imgHeight = img.height();

            if (newX > 0) {
                newX = 0;
            } else if (newX < parentWidth - imgWidth) {
                newX = parentWidth - imgWidth;
            }
            if (newY > 94.4) {
                newY = 94.4;
            } else if (newY < parentHeight - imgHeight + innerHeight) {
                newY = parentHeight - imgHeight + innerHeight;
            }
            console.log(parentHeight - imgHeight);
            img.css({left: newX + "px", top: newY + "px"});
        }

        // Preventing navigation when dragging near the bottom edge of the map
        if (event.clientY > window.innerHeight - 50) {
            event.preventDefault();
        }
    });
});
