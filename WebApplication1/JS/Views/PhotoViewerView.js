function PhotoViewerView(model) {
    AbstractConnectTableView.call(this, model);
}

PhotoViewerView.prototype = new AbstractConnectTableView();

PhotoViewerView.prototype.refreshCurrentPhoto = function (ev) {
    var path = ev.getCurrentPhotoPath();
    $("#current-photo img").fadeOut("normal", function () {
        $("#current-photo img").attr("src", path);
        $("#current-photo img").fadeIn("normal");
    });

    $("#current-photo p").fadeOut("normal", function () {
        $("#current-photo p").html(ev.getModel().pictures[ev.getCurrentPhotoId()].fileName);
        $("#current-photo img").fadeIn("normal");
    });
}