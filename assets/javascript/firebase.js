// Initialize Firebase
// Make sure to match the configuration to the script version number in the HTML
// (Ex. 3.0 != 3.7.0)
// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="https://www.gstatic.com/firebasejs/7.10.0/firebase-app.js"></script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBaIvmWXStcJxnum1vdA53M6Qn6OtGV_T0",
    authDomain: "rpschallenge-e7fd8.firebaseapp.com",
    databaseURL: "https://rpschallenge-e7fd8.firebaseio.com",
    projectId: "rpschallenge-e7fd8",
    storageBucket: "rpschallenge-e7fd8.appspot.com",
    messagingSenderId: "92598659189",
    appId: "1:92598659189:web:b03d5f5da1e2058b33b03c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Use the below variable clickCounter to keep track of the clicks.
// var clickCounter = initialValue;

// --------------------------------------------------------------
var firebaseDB = firebase.database();

// Assign the reference to the database to a variable named 'database'
// var database = ...


// Initial Values


// --------------------------------------------------------------

// At the initial load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
firebaseDB.ref().on("value", function (gameState) {
    console.log("got a call from firebase, object:", gameState);
    console.log("got a call from firebase, object player1Name: player2Name:", gameState.val().player1Name, " ", gameState.val().player2Name);
    // if (!challenge) return;     // if thisPlayer wants solitaire then return

    // If Firebase has a new state (first case)
    // if (gameState.child("player1Name").exists() && gameState.child("player2Name").exists()) {

    // Set the variables equal to the stored values in firebase.
    console.log("player1Timer: ", gameState.val().player1Timer);
    console.log("player2Timer: ", gameState.val().player2Timer);
    player1Name = gameState.val().player1Name;
    player1Id = gameState.val().player1Id;
    player1Ready = gameState.val().player1Ready;
    player1Timer = gameState.val().player1Timer;
    player1ResetCounters = gameState.val().player1ResetCounters;
    player1ChoseRock = gameState.val().player1ChoseRock;
    player1ChosePaper = gameState.val().player1ChosePaper;
    player1ChoseScissors = gameState.val().player1ChoseScissors;
    player2Name = gameState.val().player2Name;
    player2Id = gameState.val().player2Id;
    player2Ready = gameState.val().player2Ready;
    player2Timer = gameState.val().player2Timer;
    player2ResetCounters = gameState.val().player2ResetCounters;
    player2ChoseRock = gameState.val().player2ChoseRock;
    player2ChosePaper = gameState.val().player2ChosePaper;
    player2ChoseScissors = gameState.val().player2ChoseScissors;
    gameOn = gameState.val().gameOn;

    console.log("player2Name: ", player2Name, " player1Name: ", player1Name, " username ", username);
    // if (gameInProgress) return;

    if (player1Name === username) {     //next 8 lines may duplicate with updateFirebaseUsername
        isPlayer1 = true;
    }
    else if (player2Name === username) isPlayer2 = true;
    else {
        isPlayer1 = false;
        isPlayer2 = false;
        // return;
    }

    console.log("isPlayer2or1 && player 1 and 2 ready" + ((isPlayer1 || isPlayer2) && (player1Ready && player2Ready)));
    if ((isPlayer1 || isPlayer2) && (player1Ready && player2Ready)) {
        firebaseDB.ref().update({
            player1Ready: false,
            player2Ready: false,
            gameOn: true,
        });
        // player1Ready = false;
        // player2Ready = false;
        // startGame();
        // firebaseDB.ref().update({ gameOn: true });
    }

    // console.log("player1Name ", player1Name, " player2Name ", player2Name);
    // console.log("player1Id ", player1Id, " player2Id ", player2Id);
    // console.log("player1Ready ", player1Ready, " player2Ready ", player2Ready);
    // console.log("player1Timer ", player1Timer, " player2Timer ", player2Timer);
    // console.log("player1ChoseRock ", player1ChoseRock, " player2ChoseRock ", player2ChoseRock);
    // console.log("player1ChosePaper ", player1ChosePaper, " player2ChosePaper ", player2ChosePaper);
    // console.log("player1ChoseScissors ", player1ChoseScissors, " player2ChoseScissors ", player2ChoseScissors);
    // Change the HTML to reflect the stored values
    // }


    // else {
    //     console.log("made it here from database update, don't know why");


    // }


    // If any errors are experienced, log them to console.
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});


/** 
 * called from {@link roundRobinTimer}
 */
const checkFirebaseResetGameCounters = () => {
    if (isPlayer1 && player2ResetCounters) {
        firebaseDB.ref().update({ player2ResetCounters: false });
        playerWins = 0;                 // reset all counters due to new mode
        playerTies = 0;
        playerLosses = 0;
        opponentLosses = 0;
        opponentTies = 0;
        opponentWins = 0;
    }
    if (isPlayer2 && player1ResetCounters) {
        firebaseDB.ref().update({ player1ResetCounters: false });
        playerWins = 0;                 // reset all counters due to new mode
        playerTies = 0;
        playerLosses = 0;
        opponentLosses = 0;
        opponentTies = 0;
        opponentWins = 0;
    }

}


/**
 * called from {@link startGame} when in challenge mode need to reset the six choice booleans 
 * @function resetGameOnFirebase
 */
const resetGameOnFirebase = () => {
    console.log("resetGameOnFireBase: ");
    firebaseDB.ref().update({
        //gameOn: false,                  // flag set to false, since game initiated by both roundRobinTimers
        player1ChoseRock: false,
        player1ChosePaper: false,
        player1ChoseScissors: false,
        player2ChoseRock: false,
        player2ChosePaper: false,
        player2ChoseScissors: false,
    });
}


/**
 * called from {@link onClickPlay} when in challenge mode, not solitaire, update firebase player ready boolean
 * @function updateFireBasePlayerReady
 */
const updateFirebasePlayerReady = () => {
    console.log("updateFireBasePlayerReady: ");
    if (isPlayer1) {
        firebaseDB.ref().update({
            player1Ready: true,
        });
        console.log("set player1Ready true");
    } else if (isPlayer2) {
        firebaseDB.ref().update({
            player2Ready: true,
        });
        console.log("set player2Ready true");
    }
}


/**
 * called from {@link onClickRock} "rock", {@link onClickPaper} "paper", {@link onClickScissors} "scissors", update firebase with player choice
 * @function updateFirebasePlayerChose
 * @param {string} choice @value {"rock" | "paper"|"scissors"}
 */
const updateFirebasePlayerChose = (choice) => {
    console.log("updateFirebasePlayerChoice: ", choice);
    if (isPlayer1 && choice === "rock") firebaseDB.ref().update({ player1ChoseRock: true });
    if (isPlayer1 && choice === "paper") firebaseDB.ref().update({ player1ChosePaper: true });
    if (isPlayer1 && choice === "scissors") firebaseDB.ref().update({ player1ChoseScissors: true });
    if (isPlayer2 && choice === "rock") firebaseDB.ref().update({ player2ChoseRock: true });
    if (isPlayer2 && choice === "paper") firebaseDB.ref().update({ player2ChosePaper: true });
    if (isPlayer2 && choice === "scissors") firebaseDB.ref().update({ player2ChoseScissors: true });
}



/**
 * called from {@link welcome} to set username same in firebase if player1 or player1 available
 * @function updateFirebaseUsername
 */
const updateFirebaseUsername = () => {
    // isPlayer1 = false;
    // isPlayer2 = false;
    console.log("updateFirebaseUsername: ");
    if (firebaseTimeOut("player1")) {
        console.log("call to firebase take player1 position with " + username);
        firebaseSetPlayer("player1");
        isPlayer1 = true;
    } else if (firebaseTimeOut("player2")) {
        console.log("call to firebase take player2 position with " + username);
        firebaseSetPlayer("player2");
        isPlayer2 = true;
    }
}



/**
 * called from {@link roundRobinCheck} interval timer or {@link welcome} if firebase player1 or player 2 has timed-out without response can reset to this username if challenge = true i.e. challenge mode requested
 * @function firebaseTimeOut
 * @param {string} player
 * @returns {boolean}
 */
const firebaseTimeOut = (player) => {
    console.log("firebaseTimeout player1 or player2: ", player);
    var timer1Diff = moment().unix() - player1Timer;
    if (player === "player1" && (timer1Diff > sessionTimeout)) return true;
    var timer2Diff = moment().unix() - player2Timer;
    if (player === "player2" && (timer2Diff > sessionTimeout)) return true;
    console.log("fireBaseTimeOut: false");
    return false;
}



/**
 * called from {@link roundRobinCheck} interval timer or {@link welcome} if firebase player1 or player 2 has timed-out without response can reset to this username if challenge = true i.e. challenge mode requested
 * @function firebaseTimeOut
 * @param {string} player
 */
const firebaseSetPlayer = (player) => {
    console.log("firebaseSetPlayer player1 or player2: ", player);
    var timeStamp = moment().unix();
    if (player === "player1") {
        firebaseDB.ref().update({
            player1Name: username,
            player1Id: username,
            player1Ready: false,
            player1Timer: timeStamp,
            player1ResetCounters: true,
            player1ChoseRock: false,
            player1ChosePaper: false,
            player1ChoseScissors: false,
        });
    }
    if (player === "player2") {
        firebaseDB.ref().update({
            player2Name: username,
            player2Id: username,
            player2Ready: false,
            player2Timer: timeStamp,
            player2ResetCounters: true,
            player2ChoseRock: false,
            player2ChosePaper: false,
            player2ChoseScissors: false,
        });
    }

}


