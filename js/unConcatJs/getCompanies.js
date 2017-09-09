"use strict";
var listOfCompanies = 0,
    dataList = {},
    listOfNews = {},
    mainCount = "",
    tempHTML = "",
    currentName = "",
    tempParent = {},
    currentParent = {},
    typeOfSort = "sortPercent100_0",
    arrayForSort = [],
    tempArray = [],
    companyPartners = "",
    arrayOfPartners = [],
    companyPartnersHolder = $(".companyPartnersHolder"),
    body = $("body"),
    holderCountriesCompany = $(".holderCountriesCompany"),
    newsPadding = $(".newsPadding"),
    locationObj = {},
    tempCountry = "";
// аналогично формируем запрос к серверу, запрашивая список компаний
$(document).ready(function () {
    try {
        $.ajax({
            type: "POST",
            url: "http://codeit.pro/frontTestTask/company/getList", //сервер запрашивает указание протокола в явновм виде
            response: "xml",
            success: function (data) {
                dataList = data.list;
                //выводим общую длинну массива в свойстве list в окно total companies
                createListOfCompanies(data); // функция отвечает за создания блока с числом компаний и списка с компаниями
                createCircleChart(dataList);
                body.on("click", ".companyName", function (e) {
                    e.preventDefault();//отключаем стандартное событие при клике на ссылку
                    $(".companyName").css("background", "none");
                    $(this).css("background", "#a9a9a9");
                    var currentCompany = this.innerText;
                    $("." + currentCompany).show();
                    createCompanyPartnersDiv(data.list, currentCompany);
                }); // обработчик при клике на название компании в списке
                body.on("click", ".nameSort", function (e) {
                    e.preventDefault();
                    tempParent = $(this).closest(".sortCompany"); //используется для перехода по DOM дереву.
                    currentParent = document.getElementsByClassName("oneCompany"); //родительский элемент который содержимое которого будет меняться
                    arrayForSort = createArrayInsideOneCompany(currentParent);// в функции формируем массив которій дальше будем перебирать
                    if ($(this).hasClass("sortByNameA-Z")) {
                        arrayForSort.sort(sortAlphabetZtoA);
                        typeOfSort = "nameZA";
                    }
                    else {
                        arrayForSort.sort(sortAlphabetAtoZ);//перебераем массив согласно правилам функции
                        typeOfSort = "nameAZ";
                    }
                    refreshDivCompanyPartners(currentParent, arrayForSort);//обновляем содержимое родителького элемента
                    $(this).toggleClass("sortByNameA-Z");
                }); //обрабатывает клик сортировки по имени
                body.on("click", ".percentageSort", function (e) {
                    e.preventDefault();
                    tempParent = $(this).closest(".sortCompany"); //используется для перехода по DOM дереву.
                    currentParent = document.getElementsByClassName("oneCompany"); //родительский элемент который содержимое которого будет меняться
                    arrayForSort = createArrayInsideOneCompany(currentParent);// в функции формируем массив которій дальше будем перебирать
                    if ($(this).hasClass("sortBySortPercent100_0")) {
                        arrayForSort.sort(sortPercent0_100);
                        typeOfSort = "sortPercent0_100";
                    }
                    else {
                        arrayForSort.sort(sortPercent100_0);//перебераем массив согласно правилам функции
                        typeOfSort = "sortPercent100_0";
                    }
                    refreshDivCompanyPartners(currentParent, arrayForSort);//обновляем содержимое родителького элемента
                    $(this).toggleClass("sortBySortPercent100_0");
                }); //обрабатывает клик сортировки процентов
                body.on("click", ".closeHref", function (e) {
                    e.preventDefault();
                    $(".closeHolder").hide();
                    $(".infoAboutCountry").hide();
                });
                body.on("click", ".closePartnersDiv", function (e) {
                    e.preventDefault();
                    companyPartnersHolder.html("");
                    companyPartnersHolder.hide("");
                    $(".companyName").css("background", "none");
                });
                $(window).on("resize", function () {
                    createCircleChart(dataList);
                });// необходимо отслеживать изменения размеров окна для динамического изменения размеров круговой диаграммы
            }
        })
    }
    catch (e) {
        alert(e.message);
    }
    // здесь формируем запрос новостей
    try {
        $.ajax({
            type: "POST",
            url: "http://codeit.pro/frontTestTask/news/getList",
            response: "xml",
            success: function (data) {
                listOfNews = data;
                createNews(listOfNews.list);
            }
        });
    }
    catch (e) {
        alert(e.message);
    }// перехватываем ошибку, выводим на экран сообщение содержащееся в ошибке.
});
function sortPercent100_0(a, b) {
    return b.value - a.value; // указываем функции что перебор нужно вести по значениям ключа value.
}
function sortPercent0_100(a, b) {
    return a.value - b.value;
}
function sortAlphabetAtoZ(a, b) {
    return (a.name < b.name) ? -1 : (b.name < a.name) ? 1 : 0;
}
function sortAlphabetZtoA(a, b) {
    return (a.name < b.name) ? 1 : (b.name < a.name) ? -1 : 0;
}
function createListOfCompanies(data) {
    listOfCompanies = data.list.length; //записываем длинну массива в ключе list
    $("#totalCompanies").text(listOfCompanies); // выводим значение переменной на страницу
    for (var i = 0; i < data.list.length; i++) {
        currentName = data.list[i].name; //перебираем масив и имя каждой компании выводим на страницу.
        var newDi = "<div><a class='companyName' href='#'>" + currentName + "</a></div>";
        //добавляем очередной элемент в список
        $(".holderCompanies").append(newDi);
    }
}
function createCompanyPartnersDiv(dataList, name) {
    companyPartnersHolder.empty();
    for (var i = 0; i < dataList.length; i++) {
        if (dataList[i].name === name) {
            arrayOfPartners = dataList[i].partners;
            switch (typeOfSort) {
                case "sortPercent100_0":
                    arrayOfPartners.sort(sortPercent100_0);
                    break;
                case "sortPercent0_100":
                    arrayOfPartners.sort(sortPercent0_100);
                    break;
                case "nameAZ":
                    arrayOfPartners.sort(sortAlphabetAtoZ);
                    break;
                case "nameZA":
                    arrayOfPartners.sort(sortAlphabetZtoA);
                    break;
            } // Выбираем какая сортировка будет применена при открытии окна о компании.
            var newPartner = "";
            for (var j = 0; j < arrayOfPartners.length; j++) {
                newPartner = "<div class='oneCompany'><div class='percentHolder'><p class='percentValue'>" + arrayOfPartners[j].value + "</p>%</div><div class='weakLines'></div><div class='mainName'>" + arrayOfPartners[j].name + "</div></div>";
                tempHTML += newPartner;
            }
            mainCount = "<div class='companiesMainCont'>" + tempHTML + "</div>";
            companyPartners = "<div class='companyPartners " + dataList[i].name + "'><article class='sortCompany'><div class='textHolder'><h4>Company partners</h4><div><h3>Sort by: </h3><a href='#' class='nameSort'>Name</a><a href='#' class='percentageSort sortBySortPercent100_0'>Percentage</a><a href='#' class='closePartnersDiv'><img src='img/closeMenu.png' width='15' height='15' alt='closeMenu'></a></div></div>" + mainCount + "</article></div>";

        }
    }
    companyPartnersHolder.append(companyPartners);
    tempHTML = "";
    companyPartnersHolder.show();
    $(".companyPartners").show();
}
function refreshDivCompanyPartners(parent, array) {
    for (var i = 0; i < array.length; i++) {
        parent[i].getElementsByClassName("mainName")[0].innerText = array[i].name;
        parent[i].getElementsByClassName("percentValue")[0].innerText = array[i].value;
    }
}
function createArrayInsideOneCompany(b) {
    tempArray = []; //временная переменная в функции для создания массива
    for (var i = 0; i < b.length; i++) {
        tempArray[i] = {
            name: ((b[i].getElementsByClassName("mainName"))[0]).innerText,
            value: ((b[i].getElementsByClassName("percentValue"))[0]).innerText
        }
    }
    return tempArray;
}
function createCircleChart(dataList) {
    for (var i = 0; i < dataList.length; i++) {
        tempCountry = dataList[i].location.name;
        locationObj[tempCountry] = 0;
    }//первый перебор нужен чтобы обнаружить все уникальный значения(страны)
    for (var j = 0; j < dataList.length; j++) {
        locationObj[dataList[j].location.name] += 1;
    }//второй перебор массива делаем чтобы в обьекте стран учесть количество компаний в той или иной стране.
    for (var key in locationObj) {
        locationObj[key] = locationObj[key] / dataList.length * 100;
    }// третий перебор проходит по результрующему обьекту, и переводит количетсво компаний в проценты.
    drawCircle(locationObj);
}
function drawCircle(obj) {
    google.charts.load('current', {'packages': ['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    var arr = [];
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        arr.push(obj[key]);
    }
    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Country', "quantity"],
            ['Poland', arr[0]],
            ['Ukraine', arr[1]],
            ['United States', arr[2]],
            ['Norway', arr[3]],
            ['Sweden', arr[4]],
            ['Germany', arr[5]]
        ]);
        var options = {
            title: ""
        };
        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        function selectHandler() {
            var selectedItem = chart.getSelection()[0];
            if (selectedItem) {
                var selectedCountry = data.hc[selectedItem.row][0].Cf;
                openCountryList(selectedCountry);
            }
        }
        google.visualization.events.addListener(chart, 'select', selectHandler);
        chart.draw(data, options);
    }
}
function openCountryList(selectedCountry) {
    var localObj = createCountriesObject();
    createCountriesList(localObj, selectedCountry);
    var closeHolder = $(".closeHolder");
    $(".infoAboutCountry").show();
    closeHolder.show();
    closeHolder.css("display", "inline-block");
}
function createCountriesObject() {
    var locObj = {};
    var tempArr = [];
    for (var i = 0; i < dataList.length; i++) {
        var tempLoc = dataList[i].location.name;
        locObj[tempLoc] = [];
    } // создаем массив с уникальными кодами стран.
    for (var key in locObj) {
        if (!locObj.hasOwnProperty(key)) continue;
        for (var j = 0; j < dataList.length; j++) {
            if (key === dataList[j].location.name) {
                tempArr.push(dataList[j]);
            }
        }
        locObj[key] = tempArr;
        tempArr = [];
    }// в каждый ключ объекта записываем все компании которые относятся к этому региону
    return locObj;
}//Функция формирует объект согласно расположению компаний.
function createCountriesList(obj, country) {
    holderCountriesCompany.html(""); // необходимо то бы избежать дозаписи последующих кликов.
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        if (key == country) {
            for (var i = 0; i < obj[key].length; i++) {
                currentName = obj[key][i].name;
                var newDi = "<div><a class='companyName' href='#'>" + currentName + "</a></div>";
                //добавляем очередной элемент в список
                $(".countryName").text(key);
                holderCountriesCompany.append(newDi);
            }
        }
    }
}
function createNews(listOfNews) {
    var currentNewsAuthor = "",
        currentNewsDate = "",
        currentNewsLink = "",
        currentNewsDescription = "",
        currentNewsImg = "",
        currentNewsHtml,
        width,
        height;
    width = listOfNews[0].img.match(/\d{3}/)[0];
    height = listOfNews[0].img.match(/x\d{3}/)[0].substring(1);
    currentNewsHtml = "<div class='articleWrapper slider sliderNow'><div class='newsFirstRowPadding'><div class='articleWrapper'><div class='newsImg'><div><img src='" + listOfNews[0].img +
        "' alt='News Image' width='" + width +
        "' height='" + height +
        "'></div></div><div class='newsDescription'><h5><a href='//" + listOfNews[0].link +
        "'>News Title</a></h5><p class='newsText'>" + checkDescriptionLength(listOfNews[0].description) +
        "</p></div></div><div class='newsInfo'><p><span class='newsHeadline'>Autor: </span>" + listOfNews[0].author +
        "</p><p><span class='newsHeadline'>Public: </span>" + dateConvert(listOfNews[0].date) +
        "</p></div></div></div>";
    newsPadding.append(currentNewsHtml);
    for (var i = 1; i < listOfNews.length; i++) {
        currentNewsAuthor = listOfNews[i].author;
        currentNewsDate = dateConvert(listOfNews[i].date);
        currentNewsLink = listOfNews[i].link;
        currentNewsDescription = listOfNews[i].description;
        currentNewsDescription = checkDescriptionLength(currentNewsDescription);
        currentNewsImg = listOfNews[i].img;
        width = currentNewsImg.match(/\d{3}/)[0];
        height = currentNewsImg.match(/x\d{3}/)[0].substring(1);
        currentNewsHtml = "<div class='articleWrapper slider'><div class='newsFirstRowPadding'><div class='articleWrapper'><div class='newsImg'><div><img src='" + currentNewsImg +
            "' alt='News Image' height='" + height +
            "' width='" + width +
            "'></div></div><div class='newsDescription'><h5><a href='//" + currentNewsLink +
            "'>News Title</a></h5><p class='newsText'>" + currentNewsDescription +
            "</p></div></div><div class='newsInfo'><p><span class='newsHeadline'>Autor: </span>" + currentNewsAuthor +
            "</p><p><span class='newsHeadline'>Public: </span>" + currentNewsDate +
            "</p></div></div></div>";
        newsPadding.append(currentNewsHtml);
    }
}
function checkDescriptionLength(descr) {
    var maxLength,
        result = descr;
    if (window.innerWidth >= 320 && window.innerWidth <= 500)
        maxLength = 60;
    else if (window.innerWidth >= 501 && window.innerWidth <= 767)
        maxLength = 150;
    else if (window.innerWidth >= 768 && window.innerWidth <= 1023)
        maxLength = 120;
    else if (window.innerWidth >= 1024)
        maxLength = 160;
    if (descr.length > maxLength) {
        result = descr.slice(0, maxLength - 3) + "...";
    }
    return result;
} // Ограничиваем число выводимых символов в описании новости для разных размеров экрана
function dateConvert(date) {
    var a = new Date(date * 1000);
    var day = a.getDate();
    if (day < 10)
        day = "0" + day;
    var month = a.getMonth() + 1;
    if (month < 10)
        month = "0" + month;
    var year = a.getFullYear();
    return day + "." + month + "." + year;
} //Преобразуем время из формата UNIX в указанную дату.
$(window).on("throttledresize", function () {
    var options = {
        width: '100%',
        height: '100%'
    };

    var data = google.visualization.arrayToDataTable([]);
    drawChart(data, options);
}); // Блок кода необходимый для того что бы круговая диаграмма была адаптивной
if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (className) {
        var allElements;
        if (document.all) {
            allElements = document.all;
        } else {
            allElements = document.getElementsByTagName("*");
        }

        // Empty placeholder to put in the found elements with the class name
        var foundElements = [];

        for (var i = 0, ii = allElements.length; i < ii; i++) {
            if (allElements[i].className == className) {
                foundElements[foundElements.length] = allElements[i];
            }
        }
        return foundElements;
    }
} //хак для IE 11, позволяет использовать document.getElementsByClassName
