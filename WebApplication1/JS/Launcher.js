myTable = new Table();

myTable.addView(new MenuView(myTable));
myTable.addView(new DomoticView(myTable));
myTable.addView(new PhotoViewerView(myTable));

myTable.addUser(new User("user1", "green"));
myTable.addUser(new User("user1", "red"));
myTable.addUser(new User("user1", "blue"));
myTable.addUser(new User("user1", "white"));



Utils.setModel(myTable);


/*
** Listenners
*/

$("#domotic-menu-btn").click(function () {
    // Menu is Open
    if ($("#domotic-menu-btn span").hasClass("iconicfill-arrow-left")) {
        $("#domotic-menu-btn span").removeClass("iconicfill-arrow-left").addClass("iconicfill-arrow-right");
        $("#domotic-menu").animate({
            marginLeft: '-=90px'
        }, 500);
    } else // Menu is close
    {
        $("#domotic-menu-btn span").removeClass("iconicfill-arrow-right").addClass("iconicfill-arrow-left");
        $("#domotic-menu").animate({
            marginLeft: '+=90px'
        }, 500);
    }
});

$("#domotic-center-btn").click(function () {
    $("#domotic-interface").fadeIn("slow");
});

$("#domotic-interface-closebtn").click(function (ev) {
    $("#domotic-interface").fadeOut("slow");
});

/*
** Gaming center
*/

$("#gaming-center-btn-open").click(function (ev) {
    $("#gaming-center").fadeIn("slow");
});

$("#tic-tac-toe-previous-btn").click(function (ev) {
    $("#tic-tac-toe").fadeOut("slow", function () {
        $("#gaming-center").fadeIn("slow");
    });
});

/*
** Tic Tac Toe
*/


$("#tic-tac-toe-close-btn").click(function (ev) {
    $("#tic-tac-toe").fadeOut("slow");
});

$("#tic-tac-toe-btn-open").click(function (ev) {
    $("#gaming-center").fadeOut("slow", function () {
        $("#tic-tac-toe").fadeIn("slow");
    });
})

$("#gaming-center-close-btn").click(function (ev) {
    $("#gaming-center").fadeOut("slow");
});

/*
** Youtube
*/

$("#youtubeVideo-btn-open").click(function (ev) {
    $("#currentVideo").fadeIn("slow", function () {
        $("#youtube-btn-container").fadeIn("slow");
    });
});

$(".youtube-search-button").click(function (ev) {
    var userKey = $(ev.target).attr("data");
    var search = $("#" + userKey + "User-menu .menu-window .menu-windows-content-youtube input").val();
    $("#" + userKey + "User-menu .menu-window .menu-windows-content-youtube input").val("");
    $("#" + userKey + "User-keyboard").fadeOut("normal");
    $("#" + userKey + "User-menu .menu-window .menu-windows-content-youtube .youtube-result").empty();
    Utils.getModel().searchYoutube(search, Utils.nbYoutubeSearch, userKey);
});

$(".youtube-result").click(function (ev) {
    /*
    ** Boutton d'ajout ou de suppression de la video cliqué
    */
    if ($(ev.target).hasClass("youtube-result-item-btn")) {
        var id = $(ev.target).attr("data-id");
        var name = $(ev.target).attr("data-title");
        var urlImage = $(ev.target).attr("data-urlImage");
        Utils.getModel().addYoutubeVideo(new YoutubeVideo(id, name, urlImage));

    }
});

$("#close-youtube-player-btn").click(function(ev) {
    $("#currentVideo").fadeOut("slow", function () {
        $("#currentVideo").empty();
    });
    $("#youtube-btn-container").fadeOut("slow");
});

$("#previous-youtube-player-btn").click(function (ev) {
    $("#currentVideo").fadeOut("slow");
    $("#youtube-btn-container").fadeOut("slow");
});


/*
* Menu
*/

$(".youtube-icon").click(function (ev) {
    var userKey = $(ev.target).attr("user-key");
    var model = Utils.getModel();
    var user = model.getUser(userKey);
    model.setMenuState(user, "youtube");
});

$(".music-icon").click(function (ev) {
    var userKey = $(ev.target).attr("user-key");
    var model = Utils.getModel();
    var user = model.getUser(userKey);
    model.setMenuState(user, "music");
});

$(".picture-icon").click(function (ev) {
    var userKey = $(ev.target).attr("user-key");
    var model = Utils.getModel();
    var user = model.getUser(userKey);
    model.setMenuState(user, "picture");
});

$(".principalMenu-icon").click(function (ev) {
    var userKey = $(ev.target).attr("user-key");
    var model = Utils.getModel();
    var user = model.getUser(userKey);
    model.setMenuState(user, "menu");
});

/*
** Keyboard Listenners
*/

$("#greenUser-keyboard").click(function (ev) {
    var elt = $(ev.target);
    if (elt.hasClass("key")) {
        var key = elt.attr("data");
        var elt = Utils.greenKeyBoardElt;
        var txt = elt.val();
        elt.val(txt + key);
    }
});

$("#redUser-keyboard").click(function (ev) {
    var elt = $(ev.target);
    if (elt.hasClass("key")) {
        var key = elt.attr("data");
        var elt = Utils.redKeyBoardElt;
        var txt = elt.val();
        elt.val(txt + key);
    }
});

/*
** Music 
*/

$('.menu-windows-content-musics').click(function (ev) {
    var elt = $(ev.target);
    if (elt.hasClass("play-music")) {
        var path = elt.attr("data");
        $("#audio-balise").attr("src", path);
    }
});

$("#photo-viewer-close-btn").click(function (ev) {
    $("#photo-viewer").fadeOut("slow");
});

/*
** Photos
*/

$(".menu-windows-content-photos").click(function (ev) {
    var elt = $(ev.target);
    if (elt.hasClass("photo-full-size")) {
        var path = elt.attr("data-path");
        var id = elt.attr("data-id");
        Utils.getModel().setCurrentPhoto(path, id);
        $("#photo-viewer").fadeIn("slow");
    }
});

$("#photos-mini").click(function (ev) {
    var elt = $(ev.target);
    if (elt.hasClass("photos-item")) {
        var path = elt.attr("data-path");
        var id = elt.attr("data-id");
        Utils.getModel().setCurrentPhoto(path, id);
    }
});

$("#previous-currentPhoto").click(function (ev) {
    Utils.getModel().previousPhoto();
});

$("#next-currentPhoto").click(function (ev) {
    Utils.getModel().nextPhoto();
});


/*
** Initialisation du menu
*/

$('.menu').circleMenu({
    item_diameter: 25,
    circle_radius: 105,
    direction: 'full',
    trigger: 'none',
    speed: 1000,
    trigger: 'none'
});

$('.menu-icon').circleMenu({
    select: function (evt, item) {
    }
});








