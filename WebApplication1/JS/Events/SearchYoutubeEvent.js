function SearchYoutubeEvent(model, youtubeResult, user) {
    AbstractConnectTableEvent.call(this, model);
    this.youtubeResult = youtubeResult;
    this.user = user;
}

SearchYoutubeEvent.prototype = new AbstractConnectTableEvent();

SearchYoutubeEvent.prototype.getYoutubeResult = function () {
    return this.youtubeResult;
}

SearchYoutubeEvent.prototype.getUser = function () {
    return this.user;
}