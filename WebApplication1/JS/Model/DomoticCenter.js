function DomoticCenter(JSONPath) {
    this.JSONPath = JSONPath;
    this.domoticElements;
    this.initData();
}

DomoticCenter.prototype.initData = function () {
    this.domoticElements = [
		{
		    "name": "firstPlug",
		    "protocol": "lighting2",
		    "url": {
		        "On": "http://192.168.43.74:6969/device/on/1",
		        "Off": "http://192.168.43.74:6969/device/off/1"
		    },
		    "id": 1,
		    "power": false
		},
		{
		    "name": "secondPlug",
		    "protocol": "lighting2",
		    "url": {
		        "On": "http://192.168.43.74:6969/device/on/2",
		        "Off": "http://192.168.43.74:6969/device/off/2"
		    },
		    "id": 2,
		    "power": false
		},
        {
            "name": "thirdPlug",
            "protocol": "lighting2",
            "url": {
                "On": "http://192.168.43.74:6969/device/on/3",
                "Off": "http://192.168.43.74:6969/device/off/3"
            },
            "id": 3,
            "power": false
        }
    ];
}

DomoticCenter.prototype.getDomoticElement = function (elementId) {
    return this.domoticElements[elementId - 1];
}

DomoticCenter.prototype.getDomoticElements = function () {
    return this.domoticElements;
}

DomoticCenter.prototype.turnOnElement = function (elementId) {
    elementId = parseInt(elementId);
    if (this.domoticElements[parseInt(elementId)] !== undefined) {
        this.domoticElements[parseInt(elementId)].power = true;
        $.connection.signalRHub.server.turnOnDomoticElement(elementId);
    } else {
        alert("This domoticElement not exist");
    }
}

DomoticCenter.prototype.turnOffElement = function (elementId) {
    elementId = parseInt(elementId);
    if (this.domoticElements[elementId] !== undefined) {
        this.domoticElements[elementId].power = false;
        $.connection.signalRHub.server.turnOffDomoticElement(elementId);
    } else {
        alert("This domoticElement not exist");
    }
}