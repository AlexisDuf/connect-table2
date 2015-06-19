function YoutubeVideo(youtubeId, title, urlImage ) {
    this.youtubeId = youtubeId;
    this.title = title;
    this.urlImage = urlImage;
}

YoutubeVideo.prototype.getId = function () {
    return this.youtubeId;
}

YoutubeVideo.prototype.getTitle = function () {
    return this.title;
}

YoutubeVideo.prototype.getUrlImage = function () {
    return this.urlImage;
}

YoutubeVideo.prototype.getClassType = function () {
    return this.classType;
}