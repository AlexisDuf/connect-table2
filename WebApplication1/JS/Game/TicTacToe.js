//records moves
var moveLog = [0, 0, 0, 0, 0, 0, 0, 0, 0];

//turn counter
var turnNo = 1;

//var for the 8 possible wins
var leftColWin = []; //1
var midColWin = []; //2
var rightColWin = []; //3
var topRowWin = []; //4
var midRowWin = []; //5
var bottomRowWin = []; //6
var leftDiagWin = []; //7
var rightDiagWin = []; //8

//array slice returns
function linesOfThree() {
    leftColWin = [moveLog[0], moveLog[3], moveLog[6]];
    midColWin = [moveLog[1], moveLog[4], moveLog[7]];
    rightColWin = [moveLog[2], moveLog[5], moveLog[8]];
    topRowWin = moveLog.slice(0, 3);
    midRowWin = moveLog.slice(3, 6);
    bottomRowWin = moveLog.slice(-3);
    leftDiagWin = [moveLog[0], moveLog[4], moveLog[8]];
    rightDiagWin = [moveLog[2], moveLog[4], moveLog[6]];
}

//to end or continue game
var gameEnd = "no";

//game board position returns
function getPlayPosition(squareNo) {
    switch (squareNo) {
        case 1:
            return document.getElementById("sqTopLeft");
        case 2:
            return document.getElementById("sqTopMiddle");
        case 3:
            return document.getElementById("sqTopRight");
        case 4:
            return document.getElementById("sqMiddleLeft");
        case 5:
            return document.getElementById("sqMiddleMiddle");
        case 6:
            return document.getElementById("sqMiddleRight");
        case 7:
            return document.getElementById("sqBottomLeft");
        case 8:
            return document.getElementById("sqBottomMiddle");
        case 9:
            return document.getElementById("sqBottomRight");
    }
}

var playerTurn = 1;

function nextTurn(playerNo) {
    if (playerNo === 1) {
        playerTurn = 2;
        $('.message').html("player 2 turn").removeClass("align-left")
        .addClass("align-right");
    }
    else if (playerNo === 2) {
        playerTurn = 1;
        $('.message').html("player 1 turn").removeClass("align-right")
        .addClass("align-left");
    }
    console.log("it is now player " + playerTurn + " turn\n");
}

//check for a win with three in a row
function checkWin() {
    linesOfThree();

    if (leftColWin.toString() == "O,O,O" ||
        midColWin.toString() == "O,O,O" ||
        rightColWin.toString() == "O,O,O" ||
        topRowWin.toString() == "O,O,O" ||
        midRowWin.toString() == "O,O,O" ||
        bottomRowWin.toString() == "O,O,O" ||
        leftDiagWin.toString() == "O,O,O" ||
        rightDiagWin.toString() == "O,O,O") {
        console.log("player 1 wins!");
        $('.message').html("player 1 wins!").removeClass("align-right align-left");
        gameEnd = "yes";
        $('.resetButton').removeClass("hide");
    }

    else if (leftColWin.toString() == "X,X,X" ||
        midColWin.toString() == "X,X,X" ||
        rightColWin.toString() == "X,X,X" ||
        topRowWin.toString() == "X,X,X" ||
        midRowWin.toString() == "X,X,X" ||
        bottomRowWin.toString() == "X,X,X" ||
        leftDiagWin.toString() == "X,X,X" ||
        rightDiagWin.toString() == "X,X,X") {
        console.log("player 2 wins!");
        $('.message').html("player 2 wins!").removeClass("align-right align-left");
        gameEnd = "yes";
        $('.resetButton').removeClass("hide");
    }

    else {
        //do nothing
    }
}

//checks for cats game
function checkCatsGame() {
    if (turnNo == 10 && gameEnd == "no") {
        console.log("it's a cat's game!");
        $('.message').html("cat's game!").removeClass("align-right align-left");
        gameEnd = "yes";
        $('.resetButton').removeClass("hide");
    }
    else {
        //do nothing
    }
}

function makePlay(playerNo, position) {
    if (getPlayPosition(position).innerHTML === "X" ||
        getPlayPosition(position).innerHTML === "O") {
        console.log("this space has already been played!!!");
    }
    else if (playerNo === 1) {
        console.log("player1 made a turn");
        getPlayPosition(position).innerHTML = "O";
        moveLog[position - 1] = "O";
        nextTurn(1);
        turnNo++;
        console.log(turnNo);
    }
    else if (playerNo === 2) {
        console.log("player2 made a turn");
        getPlayPosition(position).innerHTML = "X";
        moveLog[position - 1] = "X";
        nextTurn(2);
        turnNo++;
        console.log(turnNo);
    }
    console.log(moveLog);
    checkWin();
    checkCatsGame();
}

//gameboard onclick function
function sqPlayed(squareNo) {
    if (gameEnd == "no") {
        console.log("player made play on position " + squareNo + "!");
        if (playerTurn === 1) {
            makePlay(1, squareNo);
        }
        else if (playerTurn === 2) {
            makePlay(2, squareNo);
        }
    }
    else if (gameEnd == "yes") {
        //do nothing
    }
}

$('.resetButton').click(function () {
    $('.resetButton').addClass("hide");
    $('.play-square').html("");
    $('.message').html("player 1 turn").removeClass("align-right")
    .addClass("align-left");

    gameEnd = "no";
    playerTurn = 1;
    turnNo = 1;

    moveLog = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    leftColWin = []; //1
    midColWin = []; //2
    rightColWin = []; //3
    topRowWin = []; //4
    midRowWin = []; //5
    bottomRowWin = []; //6
    leftDiagWin = []; //7
    rightDiagWin = []; //8
});