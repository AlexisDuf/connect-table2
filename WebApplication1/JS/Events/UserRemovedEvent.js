function UserRemovedEvent(model, user) {
    AbstractConnectTableEvent.call(this, model);
    this.user = user;
}

UserRemovedEvent.prototype = new AbstractConnectTableEvent();

UserRemovedEvent.prototype.getUser = function () {
    return this.user;
}


