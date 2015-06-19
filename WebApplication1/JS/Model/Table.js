function Table(JSONPath) {
    this.users = {};
    this.fullScreenIsOn = false;
    this.fullScreenMenuUser = undefined;
    this.domoticCenter = new DomoticCenter(JSONPath);
    this.voiceRecognition = false;
    /*
    ** Youtube 
    */
    this.currentVideo;
    this.nextVideos = new Array();

    /*
    ** Calibration
    */
    this.numberCalibration=0;
    this.calibration = true;

    this.appTopLeft;
    this.appTopRight;
    this.appBottomLeft;
    this.appBottomRight;

    this.cameraTopLeft;
    this.cameraTopRight;
    this.cameraBottomLeft;
    this.cameraBottomRight;

    this.objCalibration;

    /*
    ** Files
    */

    this.pictures;
    this.musics;

    this.picturesFolder = "Ressources/pictures/";
    this.musicsFolder = "Ressources/musics/";

    this.currentPhoto = "Ressources/img/noUsb.jpg";
    this.currentPhotoId=0;
}

Table.prototype = new AbstractModel();

/*
** Fonctions relatives à l'ajout et la suppression de vues
*/

Table.prototype.addView = function (view) {
    this.views.push(view);
    view.createView(new CreateViewEvent(this));
}

Table.prototype.removeView = function (viewId) {
    this.views[viewId].removeView();
    this.views.splice(viewId, 1);
}

/*
** Fin fonctions relatives à l'ajout et la suppression de vues
*/

/*
** GETTERS
*/

Table.prototype.fullScreenIsOn = function () {
    return this.fullScreenIsOn;
}

Table.prototype.getUsers = function () {
    return this.users;
}

Table.prototype.getFullScreenMenuUser = function () {
    return this.fullScreenMenuUser;
}

Table.prototype.getDomoticCenter = function () {
    return this.domoticCenter;
}

/*
** Utils functions
*/

Table.prototype.addUser = function (user) {
    //Utils.getHub().server.addUser;
    if (this.users[user.glassColor] == undefined) {
        this.users[user.glassColor] = user;
        this.fireEvent("refreshAddUser", new UserAddedEvent(this, user));
    } else {
        alert("This user is already connect");
    }

}

Table.prototype.removeUser = function (user) {
    //Utils.getHub().server.removeUser();
    if (this.users[user.glassColor] != undefined) {
        delete this.users[user.glassColor];
    }
    this.fireEvent("refreshRemoveUser", new UserRemovedEvent(this, user));
}

Table.prototype.getUser = function (glassColor) {
    return this.users[glassColor];
}

Table.prototype.changeUserPosition = function (user, positionX, positionY) {
    if (this.users[user.glassColor] != undefined) {
        var bottom = true;
        if (positionY > 480 / 2) {
            bottom = false;
        }
        var temp = this.changementCoordinates(positionX, positionY, this.objCalibration, bottom);
        user.updatePosition(temp.x, temp.y);
        this.fireEvent("refreshUserPosition", new UserPositionChangedEvent(this, user, bottom));
    }
}

Table.prototype.changementCoordinates = function (x, y, calibration, bottom) {
    var newCoordinates = { x: null, y: null };
    if (bottom) {
        newCoordinates.x = calibration.resolutionX - x * calibration.ratioX + calibration.xOrigine - 170;
        newCoordinates.y = y * calibration.ratioY + calibration.yOrigine - 140;
        
    } else {
        newCoordinates.x = calibration.resolutionX - x * calibration.ratioX + calibration.xOrigine + 165;
        newCoordinates.y = y * calibration.ratioY + calibration.yOrigine - 130;

    }
    return newCoordinates;
};

Table.prototype.calculateRatio = function (obj) {
    /*
    ** Fonction calculant les ratios
    */
    //valeurs fixes
    var resolutionScreenX = 1024; //px
    var resolutionScreenY = 768;  //px

    var resolutionCameraX = 640; //px
    var resolutionCameraY = 480; //px

    var espacementX = 120;
    var espacementY = 120;

    var xs1 = espacementX;
    var ys1 = espacementY;

    var xs2 = resolutionScreenX - espacementX;
    var ys2 = espacementY;

    var xs3 = espacementX;
    var ys3 = resolutionScreenY - espacementY;

    var calibration = {
        xOrigine: null,
        yOrigine: null,
        ratioX: null,
        ratioY: null,
        resolutionX: resolutionScreenX,
        resolutionY: resolutionScreenY
    }
    //Coordonnées de la caméra.
    var xc1 = obj[0].x;
    var yc1 = obj[0].y;

    var xc2 = obj[1].x;
    var yc2 = obj[1].y;

    var xc3 = obj[2].x;
    var yc3 = obj[2].y;

    //calcul de longueurs
    //camera
    var distanceCameraX = xc1 - xc2;
    var distanceCameraY = yc3 - yc1;

    //screen
    var distanceScreenX = xs2 - xs1;
    var distanceScreenY = ys3 - ys1;

    //calcul du ratioX et ratioY 
    calibration.ratioX = distanceScreenX / distanceCameraX;
    calibration.ratioY = distanceScreenY / distanceCameraY;

    //vecteur de changement de base //remise à l'origine
    calibration.xOrigine = -xs1 * (1 / calibration.ratioX);
    calibration.yOrigine = ys1 * (1 / calibration.ratioY);
    return calibration;
}


Table.prototype.switchMenuInFullScreen = function (user) {
    this.fullScreenIsOn = true;
    this.fullScreenMenuUser = user;
    this.fireEvent("refreshFullScreen", new FullScreenChangedEvent(this, this.fullScreenIsOn, this.fullScreenMenuUser));
}

Table.prototype.closeFullScreen = function () {
    this.fullScreenIsOn = false;
    this.fullScreenMenuUser = undefined;
    this.fireEvent("refreshFullScrenn", new FullScreenChangedEvent(this, this.fullScreenIsOn, this.fullScreenMenuUser));
}

Table.prototype.setMenuState = function (user, menuState) {
    if (this.users[user.glassColor] != undefined) {
        var oldState = this.users[user.glassColor].setMenuState(menuState);
        this.fireEvent("refreshMenuState", new MenuStateChangedEvent(this, user, menuState, oldState));
    }
}

Table.prototype.changeUserState = function (user, onTheTable) {
    if (this.users[user.glassColor] != undefined) {

        if (this.users[user.glassColor].canChange()) {
            console.log("can Change");
            this.users[user.glassColor].setOnTheTable(onTheTable);
            this.fireEvent("refreshUserState", new UserStateChangedEvent(this, user, onTheTable));
        } else {
            console.log("can't change");
        }
    }
}

Table.prototype.updateMediaCenter = function (ev) {
    this.mediaCenter.updateAll(ev);
}

Table.prototype.getVoiceRecognitionStatus = function () {
    return this.voiceRecognition;
}

/*
** Youtube
*/

Table.prototype.searchYoutube = function(searchText, nbResult, keyUser) {
    $.connection.signalRHub.server.searchYoutube(searchText, nbResult, keyUser);
}

Table.prototype.addYoutubeVideo = function (video) {
    this.nextVideos.push(video);
    this.nextYoutubeVideo();
}

Table.prototype.removeYoutubeVideo = function (videoId) {
    var i = 0;
    var found = false;
    while (i < this.nextVideos.length && !found) {
        if (this.nextVideos[i].Id == videoId) {
            found = true;
        }
        i++;
    }
    this.nextVideos.splice(i, 1);
}

Table.prototype.nextYoutubeVideo = function () {
    if (this.nextVideos.length > 0) {
        this.currentVideo = this.nextVideos[0];
    }
    this.nextVideos.splice(0, 1);
    this.fireEvent("refreshCurrentYoutubeVideo", new CurrentYoutubeVideoChangedEvent(this, this.currentVideo));
}

Table.prototype.updateYoutubeSearch = function (result, keyUser) {
    var user = this.getUser(keyUser);
    user.setCurrentYoutubeSearch(result);
    this.fireEvent("refreshYoutubeSearch", new SearchYoutubeEvent(this, result, user));
}

/*
** DOMOTIC
*/

Table.prototype.turnOnDomoticElement = function (domoticElementId) {
    this.domoticCenter.turnOnElement(domoticElementId);
    this.fireEvent("refreshDomoticElements", new DomoticElementStateChangedEvent(this, domoticElementId));
}

Table.prototype.turnOffDomoticElement = function (domoticElementId) {
    this.domoticCenter.turnOffElement(domoticElementId);
    this.fireEvent("refreshDomoticElements", new DomoticElementStateChangedEvent(this, domoticElementId));
}

Table.prototype.changeVoiceRecognitionStatus = function (status) {
    this.voiceRecognition = status;
    if (status) {
        $.connection.signalRHub.server.activateVoiceRecognition();
    }
    this.fireEvent("refreshVoiceRecognition", new VoiceRecognitionStatusChangedEvent(this, status));
}

/*
** UTILS
*/
Table.prototype.setNextCalibration = function (centerX, centerY) {
    var position = {};
    position.x = centerX;
    position.y = centerY;
    switch (this.numberCalibration) {
        case 0:
            this.cameraTopLeft = position;
            this.numberCalibration++;
            $("#calibration-top-left").css("display", "none");
            $("#calibration-top-right").css("display", "block");
            break;
        case 1:
            this.cameraTopRight = position;
            this.numberCalibration++;
            $("#calibration-top-right").css("display", "none");
            $("#calibration-bottom-left").css("display", "block");
            break;

        case 2:
            this.cameraBottomLeft = position;
            this.numberCalibration++;
            $("#calibration-bottom-left").css("display", "none");
            $("#calibration-bottom-right").css("display", "block");
            break;

        case 3:
            this.cameraBottomRight = position;
            $("#calibration-bottom-right").css("display", "none");
            var obj = new Array();

            obj.push(this.cameraTopLeft);
            obj.push(this.cameraTopRight);
            obj.push(this.cameraBottomLeft);

            this.objCalibration = this.calculateRatio(obj);
            this.calibration = false;
            break;
    }
}

Table.prototype.stopCalibration = function () {
    this.calibration = false;
}

Table.prototype.getCalibrationStatus = function () {
    return this.calibration;
}

/*
** Media center
*/

Table.prototype.setUsbData = function (data) {
    var files = JSON.parse(data);
    var currentFile;

    this.musics = new Array();
    this.pictures = new Array();

    console.log(files);
    /*
    ** Musics
    */
    for (var i = 0; i < files[0].length; i++) {
        currentFile = {};
        currentFile.fileName = files[0][i];
        currentFile.path = this.musicsFolder + files[1][i].replace(/^.*[\\\/]/, '');
        this.musics.push(currentFile);
    }

    /*
    ** Pictures
    */
    for (var i = 0; i < files[2].length; i++) {
        currentFile = {};
        currentFile.fileName = files[2][i];
        currentFile.path = this.picturesFolder + files[3][i].replace(/^.*[\\\/]/, '');
        this.pictures.push(currentFile);
    }

    this.setCurrentPhoto(this.pictures[0].path, 0);
    this.fireEvent("refreshUsbFiles", new UsbFilesChangedEvent(this, this.musics, this.pictures));
}

Table.prototype.setCurrentPhoto = function (path, id) {
    this.currentPhoto = path;
    this.currentPhotoId = id;
    this.fireEvent("refreshCurrentPhoto", new CurrentPhotoChangedEvent(this, path, id))
}

Table.prototype.nextPhoto = function () {
    if (this.pictures == undefined) {
        return;
    } else {
        var id = parseInt(this.currentPhotoId + 1);
        if (id >= this.pictures.length) {
            id = 0;
        }
        console.log(id);
        console.log(this.pictures[id]);
        this.setCurrentPhoto(this.pictures[id].path, id);
    }

}

Table.prototype.previousPhoto = function () {
    if (this.pictures == undefined) {
        return;
    } else {
        var id = this.currentPhotoId - 1;
        if (id < 0) {
            id = this.pictures.length - 1;
        }
        this.setCurrentPhoto(this.pictures[id].path, id);
    }

}

Table.prototype.getCurrentPhotoPath = function () {
    return this.currentPhoto;
}

Table.prototype.getCurrentPhotoId = function () {
    return this.currentPhotoId;
}
