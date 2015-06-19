function UserPositionChangedEvent(model, user, bottom) {
    AbstractConnectTableEvent.call(this, model);
    this.user = user;
    this.bottom = bottom;
}

UserPositionChangedEvent.prototype = new AbstractConnectTableEvent();

UserPositionChangedEvent.prototype.getPositionX = function () {
    return this.user.getPositionX();
}

UserPositionChangedEvent.prototype.getPositionY = function () {
    return this.user.getPositionY();
}

UserPositionChangedEvent.prototype.getUser = function () {
    return this.user;
}

UserPositionChangedEvent.prototype.isBottom = function () {
    return this.bottom;
}