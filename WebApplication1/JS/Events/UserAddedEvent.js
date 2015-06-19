function UserAddedEvent(model, newUser) {
    AbstractConnectTableEvent.call(this, model);
    this.newUser = newUser;
}

UserAddedEvent.prototype = new AbstractConnectTableEvent();

UserAddedEvent.prototype.getNewUser = function () {
    return this.newUser;
}