// Привет тому, кто это читает. Я поменял статусы устройств, чтобы тестить
// вывод иконок в зависимости от того, что придет (изначально всё было 0).

const json = { "api": { "deviceTree": { "CardReader": [{ "driver": "MicroelectronicaNFC", "modName": "CardReader", "modVersion": 1, "port": "/dev/serial/by-id/usb-Silicon_Labs_CP2104_USB_to_UART_Bridge_Controller_014DF6DF-if00-port0", "status": 0, "statusDescr": "Idling" }], "CashAcceptor": [{ "driver": "ID003", "modName": "Money", "modVersion": 3, "port": "/dev/ttyS0", "status": 1, "type": "JCM", "version": "S(UKR)-03-MW SM-BDP04V029-21 28FEB17     " }], "CashDispenser": [{ "modName": "Dispenser", "modVersion": 2, "products": [] }], "POS": [{ "driver": "Ingenico", "modName": "POS", "modVersion": 1, "options": [{}, { "merchantIdx": "1" }], "port": "/dev/serial/by-id/usb-INGENICO_Ingenico_iUP250-if00", "status": 2 }], "Printer": [{ "driver": "SeaRRO", "modName": "Printer", "modVersion": 1, "papperState": -1, "port": "/dev/serial/by-id/usb-Silicon_Labs_CP2102_USB_to_UART_Bridge_Controller_0001-if00-port0", "status": 0 }], "ProductDispenser": [{ "driver": "ICT-CVD", "modName": "Dispenser", "modVersion": 2, "port": "/dev/ttyS5", "products": [{ "class": "Fare card", "count": 75, "name": "Kharkov fare card" }], "status": 0 }] }, "deviceTreeTypeMap": { "CashDispenser": [{ "products": [] }], "POS": [{ "options": [{}, { "merchantIdx": "number" }, {}] }], "ProductDispenser": [{ "products": [{ "count": "number" }] }] } } };
const jsonADT = json.api.deviceTree;
const jsonADTTM = json.api.deviceTreeTypeMap;
const htmlRender = document.getElementById('htmlRender');
const deviceButtonsDiv = document.createElement('div');
let deviceDescribe = document.createElement('div');
deviceDescribe.id = 'deviceDescribe';
let numberValue = [];

cleanEmptyData(jsonADT);
cleanEmptyData(jsonADTTM);
getNumberValue(jsonADTTM);
createDevices(jsonADT);

// Функция удаляет пустые массивы и объекты из полученного JSON
// Сделаю максимально универсально, мало ли что может прийти
function cleanEmptyData(obj) {
    for (let key in obj) {
        // Удаляет null, undefined, "", " "
        if (obj[key] === null || obj[key] === undefined || obj[key] === "" || obj[key] === " ") {
            delete obj[key];
        }
        // Удаляет пустой объект (typeof Array тоже object)
        if (typeof obj[key] === 'object' && Object.keys(obj[key]).length <= 0) {
            delete obj[key];
        }
        // Рекурсия, если объект не пустой
        if (typeof obj[key] === 'object') {
            cleanEmptyData(obj[key]);
        }
    }
    return obj;
}

function createDevices(obj) {
    for (let key in obj) {
        const deviceButton = document.createElement('button');
        deviceButton.innerHTML = key;
        deviceButton.id = key;
        deviceButton.onclick = function () {
            createHTML(jsonADT, key);
        }
        deviceButtonsDiv.id = 'deviceButtonsDiv';
        deviceButtonsDiv.appendChild(deviceButton);
        htmlRender.appendChild(deviceButtonsDiv);
    }
}

function createHTML(json, device) {
    deviceDescribe.innerHTML = ` `;
    for (key in json) {
        let h3 = document.createElement('h3');
        if (key == device) {
            h3.innerText = ' ';
            h3.innerText = key;
            h3.class = 'h3';
            let info = document.createElement('img');
            info.src = `images/information.png`;
            h3.appendChild(info);
            deviceDescribe.appendChild(h3);
            htmlRender.appendChild(deviceDescribe);
            createHTML2(json[device]);
        }
    }
}

function createHTML2(finalJson) {
    for (prop in finalJson) {
        let div = document.createElement('div');
        let status = document.createElement('img');
        if (typeof (finalJson[prop]) == 'object') {
            createHTML2(finalJson[prop]);
        } else {

            div.innerHTML = `<b>${prop}:</b> ${finalJson[prop]}`;
            if (finalJson[prop] == 0 && prop == "status") {
                div.class = 'status';
                status.src = `images/error.png`
                div.appendChild(status);
            } else if (finalJson[prop] == 1 && prop == "status") {
                div.class = 'status';
                status.src = `images/checkmark.png`;
                div.appendChild(status);
            } else if (finalJson[prop] != 1 && finalJson[prop] != 0 && prop == "status") {
                div.class = 'status';
                status.src = `images/warning.png`;
                div.appendChild(status);
            }
            for (i = 0; i <= numberValue.length; i++) {
                if (finalJson.hasOwnProperty(numberValue[i])) {
                    if (finalJson[prop] == finalJson[numberValue[i]]) {
                        let inputChange = document.createElement('input');
                        let buttonChange = document.createElement('button');
                        buttonChange.innerHTML = 'Change';
                        /*
                        Кнопку уже можно сделать чтобы она высылала 
                        введённое число куда угодно
                        */
                        inputChange.type = 'number';
                        inputChange.placeholder = finalJson[prop];
                        div.appendChild(inputChange);
                        div.appendChild(buttonChange);
                    }
                }
            }
            deviceDescribe.appendChild(div);
            htmlRender.appendChild(deviceDescribe);
        }
    }
}

// Узнаем свойство (имя поля), значение которого равняется "number"
function getNumberValue(obj) {
    for (let prop in obj) {
        if (typeof (obj[prop]) === 'object') {
            getNumberValue(obj[prop]);
        } else {
            if (obj[prop] == "number") {
                numberValue.push(prop);
            }
        }
    }
}