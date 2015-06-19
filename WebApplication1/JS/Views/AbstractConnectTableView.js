/*
** Toutes les vues sont des vues-contrôleurs
On stocke donc le model dans la vue pour initialiser le controleur
*/

function AbstractConnectTableView(model) {
    this.model = model;
}

AbstractConnectTableView.prototype.getModel = function () {
    return this.model;
}

AbstractConnectTableView.prototype.setModel = function (model) {
    this.model = model;
}

AbstractConnectTableView.prototype.createView = function (ev) {}

AbstractConnectTableView.prototype.refreshAddUser = function (ev) {}

AbstractConnectTableView.prototype.refreshRemoveUser = function (ev) {}

AbstractConnectTableView.prototype.refreshUserPosition = function (ev) {}

AbstractConnectTableView.prototype.refreshFullScreen = function (ev) {}

AbstractConnectTableView.prototype.refreshMenuState = function (ev) {}

AbstractConnectTableView.prototype.refreshUserState = function (ev) { }

AbstractConnectTableView.prototype.refreshDomoticElements = function (ev) { }

AbstractConnectTableView.prototype.refreshVoiceRecognition = function (ev) { }

AbstractConnectTableView.prototype.refreshYoutubeSearch = function (ev) { }

AbstractConnectTableView.prototype.refreshCurrentYoutubeVideo = function (ev) { }

AbstractConnectTableView.prototype.refreshUsbFiles = function (ev) { }

AbstractConnectTableView.prototype.refreshCurrentPhoto = function(ev){ }