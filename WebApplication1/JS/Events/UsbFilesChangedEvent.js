function UsbFilesChangedEvent(model, musics, pictures) {
    AbstractConnectTableEvent.call(this);
    this.musics = musics;
    this.pictures = pictures;
}

UsbFilesChangedEvent.prototype = new AbstractConnectTableEvent();

UsbFilesChangedEvent.prototype.getMusics = function () {
    return this.musics;
}

UsbFilesChangedEvent.prototype.getPictures = function () {
    return this.pictures;
}