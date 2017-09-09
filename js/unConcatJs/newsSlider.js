"use strict";
var sliders,
    currentSlide = 0,
    slideGo = setInterval(nextSlide, 5000);
function nextSlide() {
    sliders = $(".slider");
    goNext();
    goToSlide(currentSlide + 1);
}

function previousSlide() {
    sliders = $(".slider");
    goPrev();
    goToSlide(currentSlide - 1);
}

function goToSlide(n) {
    sliders[currentSlide].className = 'articleWrapper slider';
    currentSlide = (n + sliders.length) % sliders.length;
    sliders[currentSlide].className = 'articleWrapper slider sliderNow';
}
$("#prevNews").on("click", function () {
    previousSlide();
});
$("#nextNews").on("click", function () {

    nextSlide();
});
function goNext() {
    var nextLabel = $(".nextLabel"),
        currentLabel = $(".currentLabel");
    nextLabel.css("background", "#696969");
    currentLabel.css("background", "#a9a9a9");
    var backBg = setTimeout(function () {
        nextLabel.css("background", "#a9a9a9");
        currentLabel.css("background", "#696969");
    }, 400);
}
function goPrev() {
    var prevLabel = $(".prevLabel"),
        currentLabel = $(".currentLabel");
    prevLabel.css("background", "#696969");
    currentLabel.css("background", "#a9a9a9");
    var backBg = setTimeout(function () {
        prevLabel.css("background", "#a9a9a9");
        currentLabel.css("background", "#696969");
    }, 400);
}