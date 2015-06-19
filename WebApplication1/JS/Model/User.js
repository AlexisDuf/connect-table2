function User(name, glassColor) {
    this.name = name;
    this.glassColor = glassColor;
    this.positionX = 0;
    this.positionY = 0;
    this.onTheTable = false;
    this.currentYoutubeSearch;
    this.state = "menu";
    this._canChange = true;
}

User.prototype.setMenuState = function (state) {
    var oldState = this.state;
    this.state = state;
    return oldState;
}

User.prototype.getMenuState = function () {
    return this.state;
}
User.prototype.getPositionX = function () {
    return this.positionX;
}
User.prototype.getPositionY = function () {
    return this.positionY;
}

User.prototype.setName = function (name) {
    this.name = name;
}

User.prototype.getName = function () {
    return this.name;
}

User.prototype.setGlassColor = function (glassColor) {
    this.glassColor = glassColor;
}

User.prototype.getGlassColor = function () {
    return this.glassColor;
}

User.prototype.updatePosition = function (positionX, positionY) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.onTheTable = true;
}

User.prototype.setOnTheTable = function (onTheTable) {
    var color = this.glassColor;
    this.onTheTable = onTheTable;
    if (onTheTable) {
        this._canChange = false;
        setTimeout(function () {
            console.log(color);
            Utils.getModel().getUser(color)._canChange = true;
        }, 2000);
    }
}

User.prototype.setCurrentYoutubeSearch = function (youtubeSearch) {
    this.currentYoutubeSearch = youtubeSearch;
}

User.prototype.getCurrentYoutubeSearch = function () {
    return this.currentYoutubeSearch;
}

User.prototype.canChange = function () {
    return this._canChange;
}