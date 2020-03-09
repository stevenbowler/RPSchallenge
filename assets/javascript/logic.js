// Initialize Firebase
// Make sure to match the configuration to the script version number in the HTML
// (Ex. 3.0 != 3.7.0)
var firebaseConfig = {
    apiKey: "AIzaSyC8Wgt67AAQOkBOIcEgL7_rOn5-g-tmjhs",
    authDomain: "fir-1-d5956.firebaseapp.com",
    databaseURL: "https://fir-1-d5956.firebaseio.com",
    projectId: "fir-1-d5956",
    storageBucket: "fir-1-d5956.appspot.com",
    messagingSenderId: "616243766257",
    appId: "1:616243766257:web:04aa93f5a036f64f71da50"
};

firebase.initializeApp(firebaseConfig);

// Use the below variable clickCounter to keep track of the clicks.
// var clickCounter = initialValue;

// --------------------------------------------------------------
var firebaseDB = firebase.database();

// Assign the reference to the database to a variable named 'database'
// var database = ...


// Initial Values
var initialBid = 0;
var initialBidder = "No one :-(";
var highPrice = initialBid;
var highBidder = initialBidder;

// --------------------------------------------------------------

// At the initial load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
firebaseDB.ref().on("value", function (snapshot) {

    // If Firebase has a highPrice and highBidder stored (first case)
    if (snapshot.child("highBidder").exists() && snapshot.child("highPrice").exists()) {

        // Set the variables for highBidder/highPrice equal to the stored values in firebase.
        highBidder = snapshot.child("highBidder").val();
        highPrice = snapshot.child("highPrice").val();


        // Change the HTML to reflect the stored values
        $("#highest-price").text(highPrice);
        $("#highest-bidder").text(highBidder);

        // Print the data to the console.
        console.log("highBidder: ", highBidder, "hightPrice", highPrice);
    }

    // Else Firebase doesn't have a highPrice/highBidder, so use the initial local values.
    else {
        $("#highest-price").text(highPrice);
        $("#highest-bidder").text(highBidder);

        // Change the HTML to reflect the initial values


        // Print the data to the console.


    }


    // If any errors are experienced, log them to console.
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// --------------------------------------------------------------



// Whenever a user clicks the submit-bid button
$("#submit-bid").on("click", function (event) {
    // Prevent form from submitting
    event.preventDefault();

    // Get the input values
    var bidderName = $("#bidder-name").val();
    var bidderPrice = $("#bidder-price").val();


    // Log the Bidder and Price (Even if not the highest)
    if (bidderPrice > highPrice) {
        highPrice = bidderPrice;
        highBidder = bidderName;
        firebaseDB.ref().set({ highBidder, highPrice });
        $("#highest-price").text(highPrice);
        $("#highest-bidder").text(highBidder);
        alert("You are now the highest bidder.");
    }
    // Alert

    // Save the new price in Firebase


    // Log the new High Price


    // Store the new high price and bidder name as a local variable


    // Change the HTML to reflect the new high price and bidder



    else {
        // Alert
        alert("Sorry that bid is too low. Try again.");
    }

});