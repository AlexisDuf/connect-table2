function CurrentPhotoChangedEvent(model, currentPhotoPath, currentPhotoId) {
    AbstractConnectTableEvent.call(this, model);
    this.currentPhotoPath = currentPhotoPath;
    this.currentPhotoId = currentPhotoId;
}

CurrentPhotoChangedEvent.prototype = new AbstractConnectTableEvent();

CurrentPhotoChangedEvent.prototype.getCurrentPhotoPath = function () {
    return this.currentPhotoPath;
}

CurrentPhotoChangedEvent.prototype.getCurrentPhotoId = function () {
    return this.currentPhotoId;
}