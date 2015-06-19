function UserStateChangedEvent(model, user, state) {
    AbstractConnectTableEvent.call(this, model);
    this.user = user;
    this.state = state;
}

UserStateChangedEvent.prototype = new AbstractConnectTableEvent();

UserStateChangedEvent.prototype.getUser = function () {
    return this.user;
}

UserStateChangedEvent.prototype.getState = function () {
    return this.state;
}

