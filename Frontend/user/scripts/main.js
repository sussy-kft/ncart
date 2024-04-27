$(document).ready(function () {
    let x = 0;
    let y = 94.4;
    let img = $("#map");
    let isDragging = false;

    // Function to handle panel toggle
    function togglePanel() {
        let panel = $("#panel");
        let toggleButton = $("#togglePanelButton");
        let toggleButtonIcon = $("#panelToggleButtonIcon");

        if (panel.css("transform") === "matrix(1, 0, 0, 1, 0, 0)") {
            panel.css("transform", "translateY(-350px)"); // Módosítás: Felfelé elrejtés
            panel.css("top", "90"); // Módosítás: tetejére helyezés
            toggleButtonIcon.attr("class", "bi bi-chevron-down"); // Change icon to right arrow
        } else {
            panel.css("transform", "translateY(0)"); // Módosítás: Felfelé megjelenítés
            panel.css("top", null); // Módosítás: alaphelyzet visszaállítása
            toggleButton.css("transform", "translateY(0)"); // Módosítás: gomb megjelenítése
            toggleButtonIcon.attr("class", "bi bi-chevron-up"); // Change icon to left arrow
        }
    }

    // Mouse down event for map dragging
    img.on("mousedown", function (event) {
        isDragging = true;
        let offset = img.offset();
        x = event.clientX - offset.left;
        y = event.clientY - offset.top;
    });

    // Mouse up event for ending dragging
    $(document).on("mouseup", function (event) {
        if (isDragging) {
            isDragging = false;
        }
    });

    // Mouse move event for dragging
    $(document).on("mousemove", function (event) {
        if (isDragging) {
            let newX = event.clientX - x;
            let newY = event.clientY - y;

            // Limiting movement within bounds of map container
            let parentWidth = img.parent().width();
            let parentHeight = img.parent().height();
            let imgWidth = img.width();
            let imgHeight = img.height();

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

            img.css({left: newX + "px", top: newY + "px"});
        }

        // Preventing navigation when dragging near bottom edge of map
        if (event.clientY > window.innerHeight - 50) {
            event.preventDefault();
        }
    });

    // Hamburger menu click event
    $("#hamburger").on("click", function () {
        let x = $("#myTopnav");
        let y = $("#panel")
        x.toggleClass("responsive");
        y.toggleClass("responsive");
    });

    // Panel toggle button click event
    $("#togglePanelButton").on("click", function () {
        togglePanel();
    });

    // Adjust toggle button position initially
    togglePanel();
});
