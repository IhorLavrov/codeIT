"use strict";
function sendGet() {
    var form = $("#regForm"),
        msg = form.serialize();// сериализуем данные формы для формирования запроса на сервер.;
    // формируем запрос на сервер со следующими параметрами, и получаем ответ в виде объекта data
    if (checkForm(form)) {
        $.ajax({
            type: "POST",
            url: "http://codeit.pro/frontTestTask/user/registration",
            data: msg,
            response: "xml",
            success: function (data) {
                // проверяем статус обработки запроса. Если всё ок - переходим на страницу. Иначе - выводим сообщение с проблемой.
                if (data.status == "OK") {
                    location.href = "companies.html";
                }
                else {
                    alert(data.message);
                }
            }
        });
    }

}
function checkForm(form) {
    var element,
        elementName,
        value,
        type,
        errors = [],
        errorsText = {
            1: 'Name is empty',
            2: 'SecondName is empty',
            3: 'E-mail is empty',
            4: 'You need to choose password',
            5: 'You should agree with Conditions and Agreements'
        },
        errorMessage;
    for (var i = 0; i < form[0].length; i++) {
        element = form[0][i];
        elementName = element.nodeName.toLowerCase();
        value = element.value;
        if (elementName == "input") {
            type = element.type;
            switch (type) {
                case "text":
                    if (element.name == "name" && value == "") errors.push(1);
                    if (element.name == "secondname" && value == "") errors.push(2);
                    break;
                case "email":
                    if (element.name == "email" && value == "") errors.push(3);
                    break;
                case "checkbox":
                    if (element.required && !element.checked) errors.push(5);
                    break;
                case "password":
                    if (element.name == "pass" && value == "") {
                        errors.push(4);
                    }
            }
        }
    }
    if (!errors.length)
        return true;
    errorMessage = "There are next mistakes in the form: \n";
    for (var j = 0; j < errors.length; j++) {
        errorMessage += errorsText[errors[j]] + "\n";
    }
    alert(errorMessage);
    return false;
} // функция проводит первичную обработку данных и проверку заполненности элементов формы.