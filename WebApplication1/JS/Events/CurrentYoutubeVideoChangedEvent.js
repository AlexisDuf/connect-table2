function CurrentYoutubeVideoChangedEvent(model, currentVideo) {
    AbstractConnectTableEvent.call(this, model);
    this.currentVideo = currentVideo;
}

CurrentYoutubeVideoChangedEvent.prototype = new AbstractConnectTableEvent();

CurrentYoutubeVideoChangedEvent.prototype.getCurrentVideo = function () {
    return this.currentVideo;
}