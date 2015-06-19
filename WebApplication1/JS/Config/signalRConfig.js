$(function () {
    //Set the hubs URL for the connection
    $.connection.hub.url = "http://localhost:8080/signalr";

    // Declare a proxy to reference the hub.
    var server = $.connection.signalRHub;

    server.client.glassStatusChanged = function (color, centerX, centerY, onTheTable) {
        if (color != "red") {
            color = "green";
        }
        var model = Utils.getModel();
        var user = model.getUser(color);
        if (model.getCalibrationStatus()) {
            if (onTheTable) {
                model.setNextCalibration(centerX, centerY);
            }
        } else {
            if (user !== undefined) {
                if (onTheTable) {
                    model.changeUserPosition(user, centerX, centerY);
                    model.changeUserState(user, true);
                } else {
                    model.changeUserState(user, false);
                }
            }
        }

        console.log("color : " + color);
        console.log("centerX : " + centerX);
        console.log("centerY : " + centerY);
        console.log("onTheTable : " + onTheTable);
    };

    server.client.voiceRecognitionStatusChanged = function (status){
        var model = Utils.getModel();
        model.changeVoiceRecognitionStatus(status);
    };


    server.client.lightStatutChanged = function (ev) {
        var model = Utils.getModel();
    };

    server.client.usbWasDetect = function (response) {
        Utils.getModel().setUsbData(response);
    };

    server.client.returnYoutubeSearch = function (result, keyUser) {
        var model = Utils.getModel();
        var user = model.getUser(keyUser);
        model.updateYoutubeSearch(JSON.parse(result), keyUser);
    };

    $.connection.hub.start().done(function () {
    });

});