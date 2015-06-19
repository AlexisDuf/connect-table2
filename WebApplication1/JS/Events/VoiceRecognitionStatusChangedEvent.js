function VoiceRecognitionStatusChangedEvent(model, status) {
    VoiceRecognitionStatusChangedEvent.call(this, model);
    this.status = status;
}

VoiceRecognitionStatusChangedEvent.prototype = new AbstractConnectTableEvent();

VoiceRecognitionStatusChangedEvent.prototype.getStatus = function () {
    return this.status;
}
