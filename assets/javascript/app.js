// @ts-check

/** 
 * @top
 * @function top
 * @todo how to {@link pauseAudio} onclick of youtube iframe embed, i.e. play one or the other.
 * 
 * */


/**
 * Wraps all JQuery
 * @event documentReady
*/
$(document).ready(function () {

    /**
     * on click calls {@link startGame}
     * @event onClickPlay
     */
    const onClickPlay = $("#play").on("click", function () {
        startGame();
    });


    /**
     * Called from {@link onClickPlay}. Reset game variables, reset display, set timer, call {@link chooseWinner}
     * @function startGame
     */
    const startGame = () => {
        playerChoseRock = false;
        playerChosePaper = false;
        playerChoseScissors = false;
        opponentChoseRock = false;
        opponentChosePaper = false;
        opponentChoseScissors = false;
        $("#opponentFinal img").remove();
        $("#RPSfinal img").remove();
        $("#thisPlayerFinal img").remove();
        setTimeout(function () {
            console.log("called timer");
            chooseWinner()
        }, 5000);
        bounceThisPlayer();
        loadRockPaperScissors();
        bounceOpponent();
    }


    /**
     * called from {@link startGame}, set display, depending on outcome call either {@link handleLoss}, or {@link handleWin}, or {@link handleTie}
     * @function chooseWinner
     */
    const chooseWinner = () => {
        console.log("chooseWinner");

        var opponentChoice = Math.random();
        if (opponentChoice <= 0.333) opponentChoseRock = true;
        else if (opponentChoice <= .667) opponentChosePaper = true;
        else opponentChoseScissors = true;

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
    }

    /**
     * called from {@link chooseWinner}, update display with end of game status
     * @function handleWin
     */
    const handleWin = () => {
        console.log("handleWin");
        ++playerWins;
        ++opponentLosses;
        thisPlayerFinalImage.attr({ src: "./assets/img/winner.jfif" });
        $("#thisPlayerFinal").append(thisPlayerFinalImage);
        // animateCSS("#opponentFinalImage", "zoomOutLeft", function () {
        //     $("#opponentFinalImage").empty();
        //     $("#opponentFinalImage").attr({ display: "none" });
        // });
        $("#RPSimageScore").html("Game Status: <strong>You Won Blue</strong>");
        $("#thisPlayerScore").text("You Blue Wins: " + playerWins + " Ties: " + playerTies + " Losses: " + playerLosses);
        $("#opponentScore").text("Opponent Green Wins: " + opponentWins + " Ties: " + opponentTies + " Losses: " + opponentLosses);
    }



    /**
     * called from {@link chooseWinner}, update display with end of game status
     * @function handleWin
     */
    const handleLoss = () => {
        console.log("handleLoss");
        ++playerLosses;
        ++opponentWins;
        thisPlayerFinalImage.attr({ src: "./assets/img/loser.jfif" });
        $("#thisPlayerFinal").append(thisPlayerFinalImage);
        $("#RPSimageScore").html("Game Status: <strong>You Lost Blue</strong>");
        $("#thisPlayerScore").text("You Blue Wins: " + playerWins + " Ties: " + playerTies + " Losses: " + playerLosses);
        $("#opponentScore").text("Opponent Green Wins: " + opponentWins + " Ties: " + opponentTies + " Losses: " + opponentLosses);
    }



    /**
     * called from {@link chooseWinner}, update display with end of game status
     * @function handleWin
     */
    const handleTie = () => {
        console.log("handleTie");
        ++playerTies;
        ++opponentTies;
        RPSfinalImage.attr({ src: "./assets/img/tieGame.jfif" });
        $("#RPSFinal").append(RPSfinalImage);
        $("#RPSimageScore").html("Game Status: <strong>Tie</strong>");
        $("#thisPlayerScore").text("You Blue Wins: " + playerWins + " Ties: " + playerTies + " Losses: " + playerLosses);
        $("#opponentScore").text("Opponent Green Wins: " + opponentWins + " Ties: " + opponentTies + " Losses: " + opponentLosses);
    }



    /**
     *  set boolean {@link playerChoseRock} true
     * @event onClickRock
     */
    const onClickRock = $("#rock").on("click", () => {
        playerChoseRock = true;
        console.log("Rock Chosen");
    });



    /**
     * set boolean {@link playerChosePaper} true
     * @event onClickPaper 
     */
    const onClickPaper = $("#paper").on("click", () => {
        playerChosePaper = true;
        console.log("Paper Chosen");

    });



    /**
     *  set boolean {@link playerChoseScissors} true
     * @event onClickScissors
     */
    const onClickScissors = $("#scissors").on("click", () => {
        playerChoseScissors = true;
        console.log("Scissors Chosen");

    });


    /**
     * Called at start of each RPS game
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


    /**
     * Called at start of each RPS game
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


    /**
     * Called at start of each RPS game
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

    /**
     * on load window call here
     */
    bounceThisPlayer();
    loadRockPaperScissors();
    bounceOpponent();

    /**@bottom Calling the function to display the intial buttons
     */

});