function DomoticView(model) {
    AbstractConnectTableView.call(this, model);
}

DomoticView.prototype = new AbstractConnectTableView();

DomoticView.prototype.createView = function (ev) {
    var domoticElements = this.model.getDomoticCenter().getDomoticElements();
    var currentElement,
        currentDiv;
    for (var i = 0; i < domoticElements.length; i++) {
        currentElement = domoticElements[i];
        currentDiv = "";
    }
    this.initControllers();

}

DomoticView.prototype.initControllers = function () {
    var newThis = this;

    $(".domotic-interface-element-btn").click(function (ev) {
        var $div = $(ev.target);
        var deviceId = $div.attr("data");
        if ($div.hasClass("off")) {
            newThis.model.turnOnDomoticElement(deviceId);
            $div.removeClass("entypo-light-down").addClass("entypo-minus-circled");
            $div.removeClass("off").addClass("on");
        } else {
            newThis.model.turnOffDomoticElement(deviceId);
            $div.removeClass("on").addClass("off");
            $div.removeClass("entypo-minus-circled").addClass("entypo-light-down");
        }
    });

    $("#voice-recognition-btn").click(function () {
        if (newThis.model.getVoiceRecognitionStatus()) {
            console.log("voice recognition already on");
        } else {
            newThis.model.changeVoiceRecognitionStatus(true);
        }
        
    });
}

DomoticView.prototype.refreshVoiceRecognition = function (ev) {
    if (ev.getStatus()) {
        $("#voice-recognition-btn").removeClass("off").addClass("on");
    } else {
        $("#voice-recognition-btn").removeClass("on").addClass("off");
    }
}