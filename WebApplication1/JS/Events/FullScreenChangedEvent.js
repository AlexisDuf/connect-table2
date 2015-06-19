function FullScreenChangedEvent(model, fullScreenIsOn, user) {
    AbstractConnectTableEvent.call(this);
    this.fullScreenIsOn = fullScreenIsOn;
    this.user = user;
}

FullScreenChangedEvent.prototype = new AbstractConnectTableEvent();

FullScreenChangedEvent.prototype.fullScreenIsOn = function () {
    return this.fullScreenIsOn;
}

FullScreenChangedEvent.prototype.getUser = function () {
    return this.user;
}