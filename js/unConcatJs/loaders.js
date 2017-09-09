"use strict";
//Этот скрипт отвечает за исчезновение лоадеров. с помощью аттрибута defer скрипт выполняется после загрузки предыдщуего скрипта.
$(window).on("load", function () {
    var $loader = $(".loader");
    var svg = $loader.find(".svg");
    setInterval(function () {
        $loader.fadeOut("slow");
        $(".divCircle").fadeIn("slow");
        $(".holderCompanies").fadeIn("slow");
        $(".containerCountries").fadeIn("slow");
        $(".news").fadeIn("slow");
    }, 500);
});