function MenuView() {
    this.greenUser = $("#greenUser-menu");
    this.redUser = $("#redUser-menu");
    this.whiteUser = $("#whiteUser-menu");
    this.blueUser = $("#blueUser-menu");
    this.currentVideo = $("#currentVideo");
    this.initControllers();
}

MenuView.prototype = new AbstractConnectTableView();

/*
** Initialise listenners on menu's items
*/

MenuView.prototype.initControllers = function (event) {

    $("#greenUser-menu input").focus(function (ev) {
        var elt = $(ev.target);
        Utils.greenKeyBoardElt = elt;
        $("#greenUser-keyboard").fadeIn("normal");
    });


    $("#redUser-menu input").focus(function (ev) {
        var elt = $(ev.target);
        Utils.redKeyBoardElt = elt;
        $("#redUser-keyboard").fadeIn("normal");
    });
}


MenuView.prototype.createView = function (ev) {
    this.setModel(ev.getModel());
    this.initControllers(ev);
}

MenuView.prototype.createView = function (ev) {

}

MenuView.prototype.refreshAddUser = function (ev) {

}

MenuView.prototype.refreshRemoveUser = function (ev) {

}

MenuView.prototype.refreshUserPosition = function (ev) {
    var positionX, positionY;
    positionX = ev.getPositionX();
    positionY = ev.getPositionY();
    if (ev.getUser().getGlassColor() == "green") {
        if (ev.isBottom()) {
            this.greenUser.css("-webkit-transform", "rotate(180deg)");
        } else {
            this.greenUser.css("-webkit-transform", "rotate(0deg)");
        }
        this.greenUser.css("left", positionX + "px");
        this.greenUser.css("top", positionY + "px");
    } else if (ev.getUser().getGlassColor() == "red") {
        if (ev.isBottom()) {
            this.redUser.css("-webkit-transform", "rotate(180deg)");
        } else {
            this.redUser.css("-webkit-transform", "rotate(0deg)");
        }
        this.redUser.css("left", positionX + "px");
        this.redUser.css("top", positionY + "px");
    }
}


MenuView.prototype.refreshFullScreen = function (ev) {

}

MenuView.prototype.refreshMenuState = function (ev) {
    var oldState = ev.getOldState();
    var user, menuState, model;
    model = ev.getModel();
    user = ev.getUser();
    menuState = ev.getMenuState();
    switch(menuState) {
        case "youtube":
            $("#" + user.getGlassColor() + "User-menu .menu-window .menu-window-currentIcon").empty().append('<span class="zocial-youtube"></span>');
            $("#" + user.getGlassColor() + "User-menu .menu-window .menu-windows-title").text("Youtube");
            var callback = function(){
                $("#" + user.getGlassColor() + "User-menu .menu-window .menu-windows-content .menu-windows-content-youtube").fadeIn("slow");
            }
            this.hideOldState(user, oldState, callback);
            break;
        case "music":
            $("#" + user.getGlassColor() + "User-menu .menu-window .menu-window-currentIcon").empty().append('<span class="fontawesome-music"></span>');
            $("#" + user.getGlassColor() + "User-menu .menu-window .menu-windows-title").text("Musics");
            var callback = function () {
                $("#" + user.getGlassColor() + "User-menu .menu-window .menu-windows-content .menu-windows-content-musics").fadeIn("slow");
            }
            this.hideOldState(user, oldState, callback);
            break;
        case "picture":
            $("#" + user.getGlassColor() + "User-menu .menu-window .menu-window-currentIcon").empty().append('<span class="fontawesome-camera"></span>');
            $("#" + user.getGlassColor() + "User-menu .menu-window .menu-windows-title").text("Pictures");
            var callback = function () {
                $("#" + user.getGlassColor() + "User-menu .menu-window .menu-windows-content .menu-windows-content-photos").fadeIn("slow");
            }
            this.hideOldState(user, oldState, callback);
            break;
        case "menu":
            $("#" + user.getGlassColor() + "User-menu .menu-window .menu-window-currentIcon").empty().append('<span class="entypo-menu"></span>');
            $("#" + user.getGlassColor() + "User-menu .menu-window .menu-windows-title").text("Menu");
            $("#" + user.getGlassColor() + "User-keyboard").fadeOut("normal");
            var callback = function () {
                $("#" + user.getGlassColor() + "User-menu .menu-window .menu-windows-content .menu-windows-content-menu").fadeIn("slow");
            }
            this.hideOldState(user, oldState, callback);
            break;
    }
}

MenuView.prototype.hideOldState = function (user, oldState, callback) {
    switch (oldState) {
        case "youtube":
            $("#" + user.getGlassColor() + "User-menu .menu-window .menu-windows-content .menu-windows-content-youtube").fadeOut("slow", callback);
            break;
        case "music":
            $("#" + user.getGlassColor() + "User-menu .menu-window .menu-windows-content .menu-windows-content-musics").fadeOut("slow", callback);
            break;
        case "picture":
            $("#" + user.getGlassColor() + "User-menu .menu-window .menu-windows-content .menu-windows-content-photos").fadeOut("slow", callback);
            break;
        case "menu":
            $("#" + user.getGlassColor() + "User-menu .menu-window .menu-windows-content .menu-windows-content-menu").fadeOut("slow", callback);
            break;
    }
}

MenuView.prototype.refreshUserState = function (ev) {
    if (ev.getState()) {
        this.openUserMenu(ev.getUser());
    } else {
        this.closeMenuUser(ev.getUser());
    }
}

MenuView.prototype.refreshYoutubeSearch = function (ev) {
    var result = ev.getYoutubeResult();
    var currentDiv="";
    var user = ev.getUser();
    var $div = $("#" + user.getGlassColor() + "User-menu .menu-window .menu-windows-content .menu-windows-content-youtube .youtube-result");
    for (var i = 0; i < result.length; i++) {
        if (result[i].typeOfClass = "APIYoutube.VideoYoutube") {
            currentDiv = "";
            currentDiv += '<div class="youtube-result-item">';
            currentDiv += '<img src="';
            currentDiv += result[i].UrlImage;
            currentDiv += '" alt="" class="youtube-result-item-icon"/><span>';
            currentDiv += result[i].Title;
            currentDiv += '</span><div class="youtube-result-item-btn entypo-play" data-id="';
            currentDiv += result[i].Id;
            currentDiv += '" data-title="';
            currentDiv += result[i].Title;
            currentDiv += '" data-urlImage="';
            currentDiv += result[i].UrlImage;
            currentDiv += '"></div></div>';
            $div.append(currentDiv);
        }
        
    }
}

MenuView.prototype.refreshCurrentYoutubeVideo = function (ev) {
    var currentVideo = ev.getCurrentVideo();
    var model = ev.getModel();
    var src = '//www.youtube.com/embed/' + currentVideo.getId();
    var newVideo = '<iframe width="853" height="480" src="' + src + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
    this.currentVideo.empty().append(newVideo).fadeIn("slow", function(){
        $("#youtube-btn-container").fadeIn("slow");
    });
}

/*
** Utils functions
*/

MenuView.prototype.closeMenuUser = function (user) {
    var userColor = user.glassColor;

    $("#" + userColor + "User-menu .menu .menu-center").fadeOut("slow", function () {
        $("#" + userColor + "User-menu .menu .menu-icon").fadeOut("normal", function () {
            $("#" + userColor + "User-menu .menu").circleMenu("close");
            $("#" + userColor + "User-menu .menu-window").addClass("animated bounceOut");
            setTimeout(function () {
                $("#" + userColor + "User-menu .menu-window").removeClass("animated bounceOut").css("opacity", "0");
            }, 2000);
        });
    });
}


MenuView.prototype.openUserMenu = function (user) {
    var userColor = user.glassColor;

    $("#" + userColor + "User-menu .menu .menu-center").fadeIn("slow", function () {
        $("#" + userColor + "User-menu .menu .menu-icon").fadeIn("normal", function () {
            $("#" + userColor + "User-menu .menu").circleMenu("open");
            $("#" + userColor + "User-menu .menu-window").addClass("animated bounceIn");
            setTimeout(function () {
                $("#" + userColor + "User-menu .menu-window").removeClass("animated bounceIn").css("opacity", "1");
            }, 2000);
        });
    });
}

/*
** USB
*/

MenuView.prototype.refreshUsbFiles = function (ev) {
    var musics = ev.getMusics();
    var pictures = ev.getPictures();
    var currentMusic;
    var currentPhoto;
    var currentDiv;
    var currentPhotoDiv;
    $(".menu-windows-content-musics").empty();
    $(".menu-windows-content-photos").empty();
    $("#photos-mini").empty();

    /*
    ** Musics
    */
    for (var i = 0; i < musics.length; i++) {
        currentMusic = musics[i];
        currentDiv = "";
        currentDiv += '<div class="music-item" >';
        currentDiv += '<span class="entypo-note"></span><p>';
        currentDiv += currentMusic.fileName;
        currentDiv += '</p>';
        currentDiv += '<span class="entypo-plus play-music" data="';
        currentDiv += currentMusic.path;
        currentDiv += '"></span>';
        currentDiv += '</div>';
        $(".menu-windows-content-musics").append(currentDiv);
    }

    /*
    ** Pictures
    */
    for (var j = 0; j < pictures.length; j++) {
        /*
        ** Photo Viewer
        */
        currentPhoto = pictures[j];
        currentPhotoDiv = "";
        currentPhotoDiv += '<img class="photos-item" src="';
        currentPhotoDiv += currentPhoto.path;
        currentPhotoDiv += '" alt="Alternate Text" data-path="';
        currentPhotoDiv += currentPhoto.path;
        currentPhotoDiv += '" data-id="';
        currentPhotoDiv += j;
        currentPhotoDiv += '" />';
        $("#photos-mini").append(currentPhotoDiv);

        /*
        ** Photo lists
        */

        currentPhotoDiv = "";
        currentPhotoDiv += '<div class="photo-menu-item" >';
        currentPhotoDiv += '<span class="entypo-instagrem"></span><p>';
        currentPhotoDiv += currentPhoto.fileName;
        currentPhotoDiv += '</p>';
        currentPhotoDiv += '<span class="entypo-resize-full photo-full-size" data-path="';
        currentPhotoDiv += currentPhoto.path;
        currentPhotoDiv += '" ';
        currentPhotoDiv += ' data-id="';
        currentPhotoDiv += j;
        currentPhotoDiv += '"></span>';
        currentPhotoDiv += '</div>';
        $(".menu-windows-content-photos").append(currentPhotoDiv);

    }

    
}

