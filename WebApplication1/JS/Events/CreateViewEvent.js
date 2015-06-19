function CreateViewEvent(model) {
    AbstractConnectTableEvent.call(this, model);
}

CreateViewEvent.prototype = new AbstractConnectTableEvent();