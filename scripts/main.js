//Builds the page to be unique for each logged in user
window.onload = function () {
    HttpClient(url + "id_token=" + idToken);

};

var userIsEliminated;

//runs a test game for debugging purposes
function startTestGame() {
    HttpClient(url + "id_token=" + idToken + "&add_user=jhenry19@concordcarlisle.org");
    HttpClient(url + "id_token=" + idToken + "&add_user=19@concordcarlisle.org");
}

//gets the id token form the login and then deletes it from the local storage for security
var idToken = localStorage.getItem("idToken");
localStorage.clear();

function assignStuff() {
    try {
        userInfo = JSON.parse(userInfo);
        alive = userInfo['alive']; // not sure if this is boolean or text
        name = userInfo['name'];
        id = userInfo['id'];
        targets = userInfo['targets']; //not sure if this gets last element
        currentTarget = targets[targets.length - 1];
        //returns a list of the all the user's targets including the current one so you subtract 1
        totalEliminations = userInfo['targets'].length - 1;
        roundEliminations = userInfo['eliminations_this_round'].length;

        gotPlayerThisRound = userInfo['got_target_this_round'];

        if (alive === "false") {
            userIsEliminated = true;
        }

    }
    //If the server doesn't get the right information it sends the user to get reauthenticated
    catch (TypeError) {
        loginError();
    }

}

var url = "https://eq8o8nlcsa.execute-api.us-east-1.amazonaws.com/default/soma2?"; //base url for server requests

/********
Determines all characteristics about a player in order to personalize the webpage to display their information
********/
var alive; // not sure if this is boolean or text
var name;
var id;
var currentTarget; //not sure if this gets last element
//returns a list of the all the user's targets including the current one so you subtract 1
var totalEliminations;
var roundEliminations;

var gotPlayerThisRound;




var HttpClient = function (aUrl) {
    var anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function () {
        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) {
            // if it is a good response, do something with the info, like setting a part of the html to something
            //document.getElementById('response').innerHTML = anHttpRequest.responseText.replace(/\n/g, "<br>")
            userInfo = anHttpRequest.responseText;
            if (userInfo === "Something went wrong verifying the account") loginError();
            console.log(userInfo);
            assignStuff();
            updateEliminationNumbers();
            loadingDone();
        }
    };

    anHttpRequest.open("GET", aUrl, true);
    anHttpRequest.send(null);

};

function loginError() {
    alert("Wait for the game to begin.")
}


var HttpClientForElimination = function (aUrl) {
    var anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function () {
        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) {
            // if it is a good response, do something with the info, like setting a part of the html to something
            //document.getElementById('response').innerHTML = anHttpRequest.responseText.replace(/\n/g, "<br>")
            elimination = JSON.parse(anHttpRequest.responseText);
            // {"old_target_name": "", "new_target_name": "Julian Matthew Henry", "new_target_email": "jhenry19@concordcarlisle.org"}
            if (elimination === "The id you provided is not your target's id.") { //message only shows up to show error
                showSubmissionResult("That is not your target's ID. If you believe this is a mistake contact the game officials")
            } else {
                showSubmissionResult("Congrats! You have successfully eliminated your target. Reload the page to see your new target...")
            }
        }
    };

    anHttpRequest.open("GET", aUrl, true);
    anHttpRequest.send(null);

};


//Deletes the loading spinner
function loadingDone() {
    var spinner = document.getElementById("loading-spinner");
    spinner.parentNode.removeChild(spinner);
}

function createLoadingForForm(){
    var thing = document.createElement("div")
    thing.class = "spinner-border text-danger";
    thing.id = "loading-spinner";
    thing.role = "status";
    var innerThing = document.createElement("span");
    innerThing.class = "sr-only";
    thing.appendChild(innerThing);
    
    var element = document.getElementById("target-form");
    element.appendChild(thing);
    

}

//Sets the personalized content for users
function updateEliminationNumbers() {
    document.getElementById("name").innerHTML = name;
    document.getElementById("id-number").innerHTML = id;
    document.getElementById("alive").innerHTML = alive;
    document.getElementById("current-target").innerHTML = currentTarget;
    document.getElementById("total-eliminations").innerHTML = totalEliminations;
    document.getElementById("round-eliminations").innerHTML = roundEliminations;
}

//Displays a warning for when the form is submitted
function showSubmissionResult(text) {
    var previousWarning = document.getElementById("warning")
    if (previousWarning !== null) previousWarning.parentNode.removeChild(previousWarning);
    var thing = document.createElement("span")
    thing.class = "main-text";
    thing.id = "warning";
    var node = document.createTextNode(text);
    thing.appendChild(node);
    var element = document.getElementById("target-form");
    element.appendChild(thing);
}

function checkForElimination(form) {
    var targetID = document.getElementById("targetID").value;

    if (userIsEliminated) showSubmissionResult("I'm sorry but you have been eliminated. Thank you for playing!")
    else if (targetID == parseInt(id)) showSubmissionResult("You entered your own id! Why would you want to eliminate yourself from the game?")
    else {
        HttpClientForElimination(url + "id_token=" + idToken + "&register_elimination=" + targetID);

    }
}
