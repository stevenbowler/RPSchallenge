// @ts-check


/** 
 * @top
 * @function top
 * @todo move #challenge button to #RPSimageStatus
 * @todo occasionally lose game sync of counters, likely due to timing, first test change timerId interval to 0.5sec from 1sec
 * @todo how to {@link pauseAudio} onclick of youtube iframe embed, i.e. play one or the other.
 * 
 * */

/**
 * Wraps all JQuery
 * @event documentReady
*/
$(document).ready(function () {

    /**on click calls {@link startGame} in solitaire, else calls {@link updateFirebasePlayerReady} in multi-player
     * @event onClickPlay
     */
    const onClickPlay = $("#play").on("click", function () {
        if (!challenge) startGame();
        else updateFirebasePlayerReady();
    });

    const displayRockPaperScissorsButtons = () => {
        $("#rock").css({ display: "block" });
        $("#paper").css({ display: "block" });
        $("#scissors").css({ display: "block" });
        $("#play").css({ display: "none" });
        $("#challenge").css({ display: "none" });

    }

    /**called from {@link onClickPlay} in Solitaire mode or from {@link roundRobinCheck} when not in Solitaire mode
     * @function startGame
     */
    const startGame = () => {
        displayRockPaperScissorsButtons();
        playerChoseRock = false;
        playerChosePaper = false;
        playerChoseScissors = false;
        opponentChoseRock = false;
        opponentChosePaper = false;
        opponentChoseScissors = false;
        if (challenge && (isPlayer1 || isPlayer2)) resetGameOnFirebase();
        $("#opponentFinal img").remove();
        $("#RPSfinal img").remove();
        $("#thisPlayerFinal img").remove();
        gameInProgress = true;
        setTimeout(function () {
            console.log("called timer");
            chooseWinner()
        }, 5000);
        bounceThisPlayer();
        loadRockPaperScissors();
        bounceOpponent();
    }



    /**called from {@link startGame}, set display, depending on outcome call either {@link handleLoss}, or {@link handleWin}, or {@link handleTie}
     * @function chooseWinner
     */
    const chooseWinner = () => {
        console.log("chooseWinner");
        firebaseDB.ref().update({ gameOn: false });
        gameOn = false;
        if (!challenge) {
            var opponentChoice = Math.random();
            if (opponentChoice <= 0.333) opponentChoseRock = true;
            else if (opponentChoice <= .667) opponentChosePaper = true;
            else opponentChoseScissors = true;
        } else if (isPlayer1) {                     // if thisPlayer is player1 in firebase then assign player 2 choices to opponent
            console.log("player is player 1, chose challenge ended up in chooseWinner Challenge loop");
            opponentChoseRock = player2ChoseRock;
            opponentChosePaper = player2ChosePaper;
            opponentChoseScissors = player2ChoseScissors;
        }
        else if (isPlayer2) {                       // if thisPlayer is player2 in firebase then assign player 1 choices to opponent
            console.log("player is player 2, chose challenge ended up in chooseWinner Challenge loop");
            opponentChoseRock = player1ChoseRock;
            opponentChosePaper = player1ChosePaper;
            opponentChoseScissors = player1ChoseScissors;
        }

        if (opponentChoseRock) $("#opponentImage").attr("src", "./assets/img/rock-you.png");
        if (opponentChosePaper) $("#opponentImage").attr("src", "./assets/img/paper-you.png");
        if (opponentChoseScissors) $("#opponentImage").attr("src", "./assets/img/scissors-you.png");

        if (playerChoseRock) $("#thisPlayerImage").attr("src", "./assets/img/rock-cpu.png");
        if (playerChosePaper) $("#thisPlayerImage").attr("src", "./assets/img/paper-cpu.png");
        if (playerChoseScissors) $("#thisPlayerImage").attr("src", "./assets/img/scissors-cpu.png");

        if ((playerChoseRock && opponentChoseScissors) ||
            (playerChosePaper && opponentChoseRock) ||
            (playerChoseScissors && opponentChosePaper)) handleWin();

        if ((playerChoseRock && opponentChosePaper) ||
            (playerChosePaper && opponentChoseScissors) ||
            (playerChoseScissors && opponentChoseRock)) handleLoss();

        if ((playerChoseRock && opponentChoseRock) ||
            (playerChosePaper && opponentChosePaper) ||
            (playerChoseScissors && opponentChoseScissors)) handleTie();

        gameInProgress = false;
        console.log("chooseWinner gameInProgress = false");
    }



    /**called from {@link chooseWinner}, update display with end of game status
     * @function handleWin
     */
    const handleWin = () => {
        // console.log("handleWin");
        ++playerWins;
        ++opponentLosses;
        thisPlayerFinalImage.attr({ src: "./assets/img/winner.jfif" });
        $("#thisPlayerFinal").append(thisPlayerFinalImage);
        $("#RPSimageScore").html("Last Game: <strong>You Won</strong>" + "<p>Game Mode: <strong>" + `${challenge ? "Multi-Player Challenge. " : "Solitaire. "}` + "</p><p>"
            + `${(!challenge && (firebaseTimeOut("player1") || firebaseTimeOut("player2"))) ? " Challenge Spot available, Option: Click go to Challenge" : ""}`
            + `${(challenge && (firebaseTimeOut("player1") || firebaseTimeOut("player2"))) ? " No challengers online, Option: Click go to Solitaire" : ""}`
            + "</strong></p>");
        updateScoreBoard();
    }



    /**called from {@link chooseWinner}, update display with end of game status
    * @function handleLoss
    */
    const handleLoss = () => {
        // console.log("handleLoss");
        ++playerLosses;
        ++opponentWins;
        thisPlayerFinalImage.attr({ src: "./assets/img/loser.jfif" });
        $("#thisPlayerFinal").append(thisPlayerFinalImage);
        $("#RPSimageScore").html("Last Game: <strong>You lost</strong>" + "<p>Game Mode: <strong>" + `${challenge ? "Multi-Player Challenge. " : "Solitaire. "}` + "</p><p>"
            + `${(!challenge && (firebaseTimeOut("player1") || firebaseTimeOut("player2"))) ? " Challenge Spot available, Option: Click go to Challenge" : ""}`
            + `${(challenge && (firebaseTimeOut("player1") || firebaseTimeOut("player2"))) ? " No challengers online, Option: Click go to Solitaire" : ""}`
            + "</strong></p>");
        updateScoreBoard();
    }



    /**called from {@link chooseWinner}, update display with end of game status
     * @function handleTie
     */
    const handleTie = () => {
        // console.log("handleTie");
        ++playerTies;
        ++opponentTies;
        RPSfinalImage.attr({ src: "./assets/img/tieGame.jfif" });
        $("#RPSFinal").append(RPSfinalImage);
        $("#RPSimageScore").html("Last Game: <strong>Tie</strong>" + "<p>Game Mode: <strong>" + `${challenge ? "Multi-Player Challenge. " : "Solitaire. "}` + "</p><p>"
            + `${(!challenge && (firebaseTimeOut("player1") || firebaseTimeOut("player2"))) ? " Challenge Spot available, Option: Click go to Challenge" : ""}`
            + `${(challenge && (firebaseTimeOut("player1") || firebaseTimeOut("player2"))) ? " No challengers online, Option: Click go to Solitaire" : ""}`
            + "</strong></p>");
        updateScoreBoard();
    }



    /**called from {@link handleLoss}, {@link handleWin}, {@link handleTie} at end of each game
     * @function updateScoreBoard
     */
    const updateScoreBoard = () => {
        $("#thisPlayerScore").html("You are Blue<p>Wins: " + playerWins + " Ties: " + playerTies + " Losses: " + playerLosses + "</p><p>Your Name: " + username + "</p>");
        $("#opponentScore").html("Opponent Green<p>Wins: " + opponentWins + " Ties: " + opponentTies + " Losses: " + opponentLosses + "</p><p>" + `${(isPlayer1 || isPlayer2) ? "Opponent Name: " : "Available?:"}` + `${player1Name === username ? player2Name : player1Name}` + "</p>");
        //hide selection buttons until next game
        // if (challenge) $("#opponentScore").html("Opponent Green<p>Wins: " + opponentWins + " Ties: " + opponentTies + " Losses: " + opponentLosses + "</p><p>Opponent Name: " + `${player1Name === username ? player2Name : player1Name}` + "</p>");
        // else $("#opponentScore").html("Opponent is Green<p>Wins: " + opponentWins + " Ties: " + opponentTies + " Losses: " + opponentLosses + "</p>");
    }

    const hideRockPaperScissorsButtons = () => {
        $("#rock").css({ display: "none" });
        $("#paper").css({ display: "none" });
        $("#scissors").css({ display: "none" });
        $("#play").css({ display: "block" });
        $("#challenge").css({ display: "block" });
    }


    /**set boolean {@link playerChoseRock} true
     * @event onClickRock
     * 
     */
    const onClickRock = $("#rock").on("click", () => {
        hideRockPaperScissorsButtons();
        playerChoseRock = true;
        updateFirebasePlayerChose("rock");
        console.log("Rock Chosen");
    });



    /**set boolean {@link playerChosePaper} true
     * @event onClickPaper 
     */
    const onClickPaper = $("#paper").on("click", () => {
        hideRockPaperScissorsButtons();
        playerChosePaper = true;
        updateFirebasePlayerChose("paper");
        console.log("Paper Chosen");
    });



    /**set boolean {@link playerChoseScissors} true
     * @event onClickScissors
     */
    const onClickScissors = $("#scissors").on("click", () => {
        hideRockPaperScissorsButtons();
        playerChoseScissors = true;
        updateFirebasePlayerChose("scissors");
        console.log("Scissors Chosen");
    });



    /**Called at start of each RPS game from {@link startGame}
     * @function bounceThisPlayer
     */
    const bounceThisPlayer = () => {
        $("#thisPlayerImage").attr("src", "./assets/img/rock-cpu.png");
        animateCSS("#thisPlayerImage", "tada", function () {
            animateCSS("#thisPlayerImage", "bounce", function () {
                animateCSS("#thisPlayerImage", "tada", function () {
                    animateCSS("#thisPlayerImage", "bounce");
                });
            });
        });
    }



    /**Called at start of each RPS game from {@link startGame}
     * @function bounceOpponent
     */
    const bounceOpponent = () => {
        $("#opponentImage").attr("src", "./assets/img/rock-you.png");
        animateCSS("#opponentImage", "bounce", function () {
            animateCSS("#opponentImage", "tada", function () {
                animateCSS("#opponentImage", "bounce", function () {
                    animateCSS("#opponentImage", "tada");
                });
            });
        });
    }



    /**Called at start of each RPS game from {@link startGame}
     * @function loadRockPaperScissors
     */
    const loadRockPaperScissors = () => {
        $("#RPSimage").attr({ src: "./assets/img/rpsRockStarter.jpg" });
        animateCSS("#RPSimage", "zoomInLeft", function () {
            $("#RPSimage").attr("src", "./assets/img/rpsPaperStarter.jpg");
            animateCSS("#RPSimage", "zoomInRight", function () {
                $("#RPSimage").attr("src", "./assets/img/rpsScissorsStarter.jpg");
                animateCSS("#RPSimage", "zoomInLeft", function () {
                    $("#RPSimage").attr("src", "./assets/img/rpsShootStarter.jpg");
                    animateCSS("#RPSimage", "zoomInRight");
                });
            });
        });
    }



    /**reset game counters at various points in game {@link onClickChallengeSolitaire}, {@link checkFirebaseRestGameCounters}
     * @function resetGameCounters
     */
    const resetGameCounters = () => {
        playerWins = 0;                 // reset all counters due to new mode
        playerTies = 0;
        playerLosses = 0;
        opponentLosses = 0;
        opponentTies = 0;
        opponentWins = 0;
    }



    /**when user clicks to toggle between Challenge mode and Solitaire mode, calls {@link updateFirebaseUsername}, and {@link firebaseTimeOut}
     * @event onClickChallengeSolitaire
     */
    const onClickChallengeSolitaire = $("#challenge").on("click", () => {
        if (challenge) {    //go back to Solitaire mode
            clearInterval(timerId);
            resetGameCounters();
            challenge = false;
            console.log("updated player 1 or 2 with " + username + " based onClick to Solitaire Mode");
            $("#challenge").text("Go to Multi-player Mode");

            $("#RPSimageScore").html("<p>Game Mode just changed to: <strong>"
                + `${challenge ? "Multi-Player Challenge. " : "Solitaire. "}` + "</p><p>"
                + `${(!challenge && (firebaseTimeOut("player1") || firebaseTimeOut("player2"))) ? " Multi-Player Spot is available" : " No Challenge available"}`
                + "</strong></p>"
                // + "<button id=challenge class=bg-danger>Go to Multiplayer Mode</button>"
            );
            // $("#RPSimageScore").append(challengeButton);
            if (username === player1Name) firebaseDB.ref().update({ player1Name: "Logged out. Game Over.", player1Timer: 2, player1ResetCounters: true });
            if (username === player2Name) firebaseDB.ref().update({ player2Name: "Logged out. Game Over.", player2Timer: 2, player2ResetCounters: true });
            $("#rock").css({ display: "block" });
            $("#paper").css({ display: "block" });
            $("#scissors").css({ display: "block" });
        } else if (!challenge) {
            resetGameCounters();
            updateFirebaseUsername();   //add this username to firebase in multi-player mode
            challenge = true;
            console.log("updated player 1 or 2 with " + username + " based onClick Challenge Mode");
            timerId = setInterval(() => {
                roundRobinCheck();
            }, 1000);
            $("#challenge").text("Go to Solitaire Mode");
            $("#RPSimageScore").html("<p>Game Mode just changed to: <strong>"
                + `${challenge ? "Multi-Player Challenge. " : "Solitaire. "}` + "</strong></p>"
                // + "<button id=challenge class=bg-danger>Go to Solitaire Mode</button>"

            );
            // $("#RPSimageScore").append(challengeButton);
        }
    });



    /**called from load from setTimer, in multi-user mode setInterval {@link timerId} to call {@link roundRobinCheck}, else solitaire mode.
     * @function welcome
     */
    const welcome = () => {

        username = prompt("please enter your username: ");
        updateFirebaseUsername();
        if (isPlayer1 && (firebaseTimeOut("player2"))) {        //player1 is only player online
            firebaseDB.ref().update({
                player2Name: "No One Else Online",
                player2Ready: false
            });
            alert("Only one challenge player (you). You will be in solitaire mode.  You will be notified when a challenger arrives, click GO TO MULTI-PLAYER button to join");
        } else if (isPlayer2 && firebaseTimeOut("player1")) {  //player2 is only player online
            firebaseDB.ref().update({
                player1Name: "No One Else Online",
                player1Ready: false,
            });
            alert("Only one challenge player (you). You will be in solitaire mode.  You will be notified when a challenger arrives, click GO TO MULTI-PLAYER button to join");
        }
        else if ((isPlayer1 && !(firebaseTimeOut("player2"))) || (isPlayer2 && !(firebaseTimeOut("player1")))) {
            challenge = confirm("Including you, there are now 2 challengers. Do you want go Multi-Player Mode? (if not, then solitaire): ");
            console.log("challenge? ", challenge);
        }
        if (challenge) {
            $("#challenge").text("Go to Solitaire Mode");
            console.log("Challenge using username: ", username);
            timerId = setInterval(() => {
                roundRobinCheck();
            }, 1000);
        }
        // else {
        //     alert("You will be in solitaire mode, click MULTI-PLAYER button when spot becomes available");
        // }
        $("#RPSimageScore").html("<p>Game Status: <strong>Starting</p><p>Click Play, then Click Rock or Paper or Scissors, then wait for result.</strong></p>" + "<p>Game Mode: " + `${challenge ? "Challenge" : "Solitaire"}` + "</p>");
    }


    var nowCounter = 0;
    var opponentReady = false;


    /**called from {@link welcome} when in multi-player/challenge=true mode, call {@link checkFirebaseRestGameCounters} if all ok call {@link startGame}
     */
    const roundRobinCheck = () => {
        // console.log("roundRobinCheck: before return ");
        if (!challenge) return;     // if in solitaire mode don't need timer function, shouldn't be on anyways
        // console.log("roundRobinCheck: after return ");

        // check if opposing player is new and reset game counters
        checkFirebaseResetGameCounters();

        // if !gameInProgress the hide rock,paper,scissors buttons
        // if (challenge && !gameInProgress) {
        //     $("#rock").css({ display: "none" });
        //     $("#paper").css({ display: "none" });
        //     $("#scissors").css({ display: "none" });
        // } else {
        //     $("#rock").css({ display: "block" });
        //     $("#paper").css({ display: "block" });
        //     $("#scissors").css({ display: "block" });
        // }

        //update timer for this player to keep this player active
        ++nowCounter;
        if (nowCounter === 60) {
            nowCounter = 0;
            var now = moment().unix();
            if (isPlayer1) firebaseDB.ref().update({ player1Timer: now });
            else if (isPlayer2) firebaseDB.ref().update({ player2Timer: now });
        }
        if (((username === player1Name) && player2Ready && !opponentReady) ||
            ((username === player2Name) && player1Ready && !opponentReady)) {
            opponentReady = true;
            $("#opponentScore").append("<p><strong>Opponent just clicked PLAY</strong></p>");
        }
        // if gameOn both players are ready, if not in progress can start
        if (gameOn && !gameInProgress) {
            gameInProgress = true;
            opponentReady = false;
            console.log("chooseWinner gameInProgress = true");
            console.log("starting game display");
            startGame();
        }
    }



    /**on load window call here
     */
    bounceThisPlayer();
    loadRockPaperScissors();
    bounceOpponent();
    hideRockPaperScissorsButtons();
    setTimeout(() => welcome(), 4000);  //wait 4 secs for load then prompt for username and challenge or solitaire


    /**@bottom Calling the function to display the intial buttons
     */




});