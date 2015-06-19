function AbstractConnectTableEvent(model) {
    this.model = model;
}

AbstractConnectTableEvent.prototype.getModel = function () {
    return this.model;
}