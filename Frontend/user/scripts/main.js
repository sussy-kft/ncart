$(document).ready(function () {
    let slideIndex = {}; // Egy objektum, amely tárolja a slide indexet minden slider-hez

    // Az összes slider bejárása, inicializálása
    $(".slider").each(function () {
        let sliderId = $(this).attr("id");
        slideIndex[sliderId] = 1; // Minden sliderhez létrehoz egy slideIndex-et
        showSlides(sliderId, slideIndex[sliderId]); // Megjeleníti az első dia képét minden sliderhez
    });

    function plusSlides(sliderId, n) {
        showSlides(sliderId, (slideIndex[sliderId] += n));
    }

    function currentSlide(sliderId, n) {
        showSlides(sliderId, (slideIndex[sliderId] = n));
    }

    function showSlides(sliderId, n) {
        let i;
        let slides = $(`#${sliderId} .mySlides`); // A megfelelő sliderhez tartozó diák
        let dots = $(`#${sliderId} .dot`); // A megfelelő sliderhez tartozó dot-ok
        if (n > slides.length) {
            slideIndex[sliderId] = 1;
        }
        if (n < 1) {
            slideIndex[sliderId] = slides.length;
        }
        for (i = 0; i < slides.length; i++) {
            $(slides[i]).css("display", "none");
        }
        for (i = 0; i < dots.length; i++) {
            $(dots[i]).removeClass("active");
        }
        $(slides[slideIndex[sliderId] - 1]).css("display", "block");
        $(dots[slideIndex[sliderId] - 1]).addClass("active");
    }

    $(".prev").on("click", function () {
        let sliderId = $(this).closest(".slider").attr("id");
        plusSlides(sliderId, -1);
    });

    $(".next").on("click", function () {
        let sliderId = $(this).closest(".slider").attr("id");
        plusSlides(sliderId, 1);
    });

    $(".dot").on("click", function () {
        let sliderId = $(this).closest(".slider").attr("id");
        currentSlide(sliderId, $(this).index() + 1);
    });

    // Új rész kezdete
    let x = 0;
    let y = 94.4;
    let img = $("#map");
    let isDragging = false;

    // Függvény a panel váltásához
    function togglePanel() {
        let panel = $("#panel");
        let toggleButton = $("#togglePanelButton");
        let toggleButtonIcon = $("#panelToggleButtonIcon");

        if (panel.css("transform") === "matrix(1, 0, 0, 1, 0, 0)") {
            panel.css("transform", "translateY(-555px)");
            panel.css("top", "90");
            toggleButtonIcon.attr("class", "bi bi-chevron-down");
        } else {
            panel.css("transform", "translateY(0)");
            panel.css("top", null);
            toggleButton.css("transform", "translateY(0)");
            toggleButtonIcon.attr("class", "bi bi-chevron-up");
        }
    }

    // Egér lenyomás esemény a térkép mozgatásához
    img.on("mousedown", function (event) {
        isDragging = true;
        let offset = img.offset();
        x = event.clientX - offset.left;
        y = event.clientY - offset.top;
    });

    // Egér felengedés esemény a mozgatás befejezéséhez
    $(document).on("mouseup", function (event) {
        if (isDragging) {
            isDragging = false;
        }
    });

    // Egér mozgatás esemény a mozgatáshoz
    $(document).on("mousemove", function (event) {
        if (isDragging) {
            let newX = event.clientX - x;
            let newY = event.clientY - y;

            // Mozgatás korlátozása a térkép konténer határain belül
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

        // Navigáció megakadályozása, ha a térkép aljánál húzza az egeret
        if (event.clientY > window.innerHeight - 50) {
            event.preventDefault();
        }
    });

    // Hamburger menü kattintás esemény
    $("#hamburger").on("click", function () {
        let x = $("#myTopnav");
        let y = $("#panel");
        x.toggleClass("responsive");
        y.toggleClass("responsive");
    });

    // Panel váltó gomb kattintás esemény
    $("#togglePanelButton").on("click", function () {
        togglePanel();
    });

    // Kezdeti gomb pozíció beállítása
    togglePanel();

    // Gomb kattintás esemény a kerületi összefoglalók megjelenítéséhez
    $("#cent button").on("click", function () {
        $("#summary > div").hide();
        $("#expCent").show();
    });

    $("#wats button").on("click", function () {
        $("#summary > div").hide();
        $("#expWats").show();
    });

    $("#hey button").on("click", function () {
        $("#summary > div").hide();
        $("#expHey").show();
    });

    $("#west button").on("click", function () {
        $("#summary > div").hide();
        $("#expWest").show();
    });

    $("#santo button").on("click", function () {
        $("#summary > div").hide();
        $("#expSanto").show();
    });

    $("#pacific button").on("click", function () {
        $("#summary > div").hide();
        $("#expPacific").show();
    });

    $("#out button").on("click", function () {
        $("#summary > div").hide();
        $("#expOut").show();
    });

    $("#dog button").on("click", function () {
        $("#summary > div").hide();
        $("#expDog").show();
    });
});
