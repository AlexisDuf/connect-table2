function MenuStateChangedEvent(model, user, menuState, oldState) {
    AbstractConnectTableEvent.call(this, model);
    this.user = user;
    this.menuState = menuState;
    this.oldState = oldState;
}

MenuStateChangedEvent.prototype = new AbstractConnectTableEvent();

MenuStateChangedEvent.prototype.getUser = function () {
    return this.user;
}

MenuStateChangedEvent.prototype.getMenuState = function () {
    return this.menuState;
}

MenuStateChangedEvent.prototype.getOldState = function () {
    return this.oldState;
}

