$(document).ready(function () {
    let x = 0;
    let y = 148;
    let zoom = 1;
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
        x = event.clientX - offset.left + (img.width()- img.width()*zoom)/2;
        y = event.clientY - offset.top + (img.height()- img.height()*zoom)/2;;
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
            // console.log(event.clientX);

            // Limiting movement within bounds of map container
            let parentWidth = img.parent().width();
            let parentHeight = img.parent().height();
            let imgWidth = img.width();
            let imgHeight = img.height();

            if (newX > 0 - (img.width()- img.width()*zoom)/2) {
                newX = 0 - (img.width()- img.width()*zoom)/2;
            } else if (newX < parentWidth - imgWidth + (img.width()- img.width()*zoom)/2) {
                newX = parentWidth - imgWidth + (img.width()- img.width()*zoom)/2;
            }
            if (newY > 148 - (img.height()- img.height()*zoom)/2) {
                newY = 148 - (img.height()- img.height()*zoom)/2;
            } else if (newY < parentHeight - imgHeight + innerHeight + (img.height()- img.height()*zoom)/2) {
                newY = parentHeight - imgHeight + innerHeight + (img.height()- img.height()*zoom)/2;
            }
            img.css({left: newX + "px", top: newY + "px"});
        }

        // Preventing navigation when dragging near bottom edge of map
        if (event.clientY > window.innerHeight - 50) {
            event.preventDefault();
        }
    });

    img.on('wheel', function(e) {
        e.preventDefault();
    
        // change zoom level based on wheel direction
        if(e.originalEvent.deltaY < 0) {
            // zoom in
            zoom += 0.1;
        } else {
            // zoom out
            zoom -= 0.1;
        }
    
        // limit zoom level between 1 and 3
        zoom = Math.min(Math.max(1, zoom), 3);

        let newX = (e.clientX - x);
        let newY = (e.clientY - y);
        // console.log(event.clientX);

        // Limiting movement within bounds of map container
        let parentWidth = img.parent().width();
        let parentHeight = img.parent().height();
        let imgWidth = img.width();
        let imgHeight = img.height();

        if (newX > 0 - (img.width()- img.width()*zoom)/2) {
            newX = 0 - (img.width()- img.width()*zoom)/2;
        } else if (newX < parentWidth - imgWidth + (img.width()- img.width()*zoom)/2) {
            newX = parentWidth - imgWidth + (img.width()- img.width()*zoom)/2;
        }
        if (newY > 148 - (img.height()- img.height()*zoom)/2) {
            newY = 148 - (img.height()- img.height()*zoom)/2;
        } else if (newY < parentHeight - imgHeight + innerHeight + (img.height()- img.height()*zoom)/2) {
            newY = parentHeight - imgHeight + innerHeight + (img.height()- img.height()*zoom)/2;
        }
        img.css({left: newX + "px", top: newY + "px"});

        // apply zoom level to image
        img.css('transform', `scale(${zoom})`);
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
