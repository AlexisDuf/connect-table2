function DomoticElementStateChangedEvent(model, elementId) {
    AbstractConnectTableEvent.call(this, model);
    this.elementId = elementId;
}

DomoticElementStateChangedEvent.prototype = new AbstractConnectTableEvent();

DomoticElementStateChangedEvent.prototype.getElementId = function () {
    return this.elementId;
}
