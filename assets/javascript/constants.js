// @ts-check

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
