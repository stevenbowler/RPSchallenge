// @ts-check

/**
 * used for set and clear of interval timer
 * @type {*}
 */
var timerId;

/**
 * timer value in seconds to timeout the player1 and player2 in challenge mode
 * @constant
 * @type {number}
 */
const sessionTimeout = 180;

/**
 * @type {boolean}
 */
var gameInProgress = false;

/**
 * @type {number}
 */
var challengers = 0;

/**
 * @type {boolean}
 */
var gameOn = false;

/**
 * false stay in solitaire mode, true if user requests to challenge then place in challenge mode in Firebase
 * @type {boolean}
 */
var challenge = false;


/**
 * @type {string}
 */
var username = "";



var player1Name = "notAssigned";
var player1Id = "notAssigned";
var player1Ready = false;
var player1Timer = moment();
// var player1Choice = "";
var player1ChoseRock = false;
var player1ChosePaper = false;
var player1ChoseScissors = false;

var player2Name = "notAssigned";
var player2Id = "notAssigned";
var player2Ready = false;
var player2Timer = moment();
// var player2Choice = "";
var player2ChoseRock = false;
var player2ChosePaper = false;
var player2ChoseScissors = false;

var isPlayer1 = false;
var isPlayer2 = false;


/**
 * Number of wins in this session, round
 * @type {number}
 */
var playerWins = 0;

/**
 * Number of losses in this session, round
 * @type {number}
 */
var playerLosses = 0;

/**
 * Number of ties in this session, round
 * @type {number}
 */
var playerTies = 0;

/**
 * Number of opponent wins in this session, round
 * @type {number}
 */
var opponentWins = 0;

/**
 * Number of opponent losses in this session, round
 * @type {number}
 */
var opponentLosses = 0;

/**
 * Number of opponent ties in this session, round
 * @type {number}
 */
var opponentTies = 0;

/**
 * Selector for >575px display winner, loser, tie image in top row of container
 * @type {JQuery}
 */
var opponentFinalImage = $("<img id=opponentFinalImage>");

/**
 * Selector for >575px display winner, loser, tie image in top row of container
 * @type {JQuery}
 */
var RPSfinalImage = $("<img id=RPSFinalImage>");

/**
 * Selector for >575px display winner, loser, tie image in top row of container
 * @type {JQuery}
 */
var thisPlayerFinalImage = $("<img id=thisPlayerFinalImage>");


/**
 * set to true from user input each game {@link onClickRock}, set false at game Start {@link playGame}
 * @type {boolean}
 */
var playerChoseRock = false;

/**
 * set to true from user input each game {@link onClickPaper}, set false at game Start {@link playGame}
 */
var playerChosePaper = false;

/**
 * set to true from user input each game {@link onClickSciccors}, set false at game Start {@link playGame}
 * @type {boolean}
 */
var playerChoseScissors = false;

/**
 * set to true from opponent input each game {@link opponentChoice}, set false at game Start {@link playGame}
 * @type {boolean}
 */
var opponentChoseRock = false;

/**
 * one gets set to true from user input each game {@link opponentChoice}, set false at game Start {@link playGame}
 * @type {boolean}
 */
var opponentChosePaper = false;

/**
 * set to true from user input each game {@link opponentChoice}, set false at game Start {@link playGame}
 * @type {boolean}
 */
var opponentChoseScissors = false;

/**
 * Alias for id=gameAudio getElement to play/pause, JQuery selector no-op
 * @constant
 * @type {HTMLElement}
 * @default
 */
const gameAudio = document.getElementById("gameAudio");

/**
 * Alias for id=gameVideo getElement, just loads video in div, doesn't play/pause
 * @constant
 * @type {JQuery}
 * @default
 */
const gameVideo = $("#gameVideo");

/**
 * Alias for id=gameVideo getElement, just loads video in div, doesn't play/pause
 * @constant
 * @type {String}
 * @default
 */
const gameVideoSRC = "";


/** 
 * Called from {@link restart} or from play music button on home screen
 * @function playAudio
 */
const playAudio = () => {
    //@ts-ignore
    gameAudio.play();
}


/** 
 * Called from pause music button on home screen
 * @function pauseAudio
 */
const pauseAudio = () => {
    //@ts-ignore
    gameAudio.pause();
}


/**
 * Called from handleSuccess when composerName found offers youtube video in composerClues div on home screen
 */
const playVideo = () => {
    gameVideo.html(gameVideoSRC);
    animateCSS('#composerClues', 'zoomInRight');
}




/**
 * Called from various points to animate unload load of content in divs,
 *      from GitHub animate.css library
 * @async
 * @function animateCSS
 * @param {*} element div id/class/tag to be modified
 * @param {*} animationName from list of animateCSS classes
 * @param {*} [callback] required if unloading before loading div with content, async
 */
const animateCSS = (element, animationName, callback) => {
    const node = document.querySelector(element)
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}

