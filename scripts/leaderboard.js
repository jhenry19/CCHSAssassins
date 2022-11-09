window.onload = function () {
//    createLoading()
    HttpClient(url);
};

var url = "https://eq8o8nlcsa.execute-api.us-east-1.amazonaws.com/default/soma2?misc=leaderboard"; //base url for server requests



//reads all the data from the text file
function HttpClient(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);

    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                //status of file is good, so get text and do something with it:
                var allText = rawFile.responseText;
                leaderboard = JSON.parse(allText);

                createLeaderboard(leaderboard);
            }
        }
    }
    rawFile.send(null);
}


function createLeaderboard(leaderboardInfo) {

    var highestNumber = 0;
    var haveHighestNumber = [];
    var player;
    var playerEliminations;
    var seaching = true;
    var sortedList = [];
    var index;
    var allHaveNone = false;


    //removes all players with zero eliminations
    for (var i = 0; i < leaderboardInfo.length; i++) {
        if (leaderboardInfo[i].round_eliminations == 0) {
            leaderboardInfo.splice(i, 1);
        }
    }


    while (seaching) {
        //initial loop generates a list of the players with the highest score
        for (var i = 0; i < leaderboardInfo.length; i++) {


            player = leaderboardInfo[i];
            playerEliminations = parseInt(player['round_eliminations'])


            //adds player to the list if they have the highest number of eliminations
            if (playerEliminations === highestNumber) {
                haveHighestNumber.push(player);
            }
            //if the player has more eliminations than it clears the current list starts making a list of players with the same amount
            else if (playerEliminations > highestNumber) {
                haveHighestNumber = [player];
                highestNumber = playerEliminations;
            }
        }


        //removes the player from the general list if they are being added to the sorted list
        for (var z = 0; z < haveHighestNumber.length; z++) {
            player = haveHighestNumber[z].name;

            index = leaderboardInfo.findIndex(obj => obj.name === player);

            leaderboardInfo.splice(index, 1);
        }

        haveHighestNumber.sort(obj => obj.name)


        //adds the list of players to the back of the sorted list
        sortedList = sortedList.concat(haveHighestNumber);


        //stops sorting if the rest don't have any assassination
        if (highestNumber == 1) seaching = false;
        else if (highestNumber == 0) {
            allHaveNone = true;
            seaching = false;

        }

        //resets the variables for repeating while loop
        haveHighestNumber = [];
        highestNumber = 0;
    }


    //adds all qualified players to the html table the sorted list
    if (!allHaveNone) {
        for (var z = 0; z < sortedList.length; z++) {
            addPlayerToLeaderboard(sortedList[z]);
        }
    }
    loadingDone();
}

function compare(a, b) {
    if (a['name'] < b['name']) {
        return -1;
    } else if (a['name'] > b['name']) {
        return 1;
    }
    return 0;
}


//Called when the user sorts the table by total eliminations. I could do something similar to the sort for the round eliminations but I found this on W3 schools and adapted it for this project
function sortTable(index) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("leaderboard-table");
    switching = true;

    //  Makes a loop that continues to shift elements until they are in the right order
    while (switching) {
        //start by saying: no switching is done
        switching = false;
        rows = table.rows;

        //        Doesn't loop through first row bc those are the headers
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;

            //            Get the two adjacent rows. 2 is the index of the total eliminations
            x = rows[i].getElementsByTagName("TD")[index];
            y = rows[i + 1].getElementsByTagName("TD")[index];

            //check if the two rows should switch place:
            if (Number(x.innerHTML) < Number(y.innerHTML)) {
                shouldSwitch = true;
                break;
            }
        }
        //switches the rows if they should be switched
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}


//Deletes the loading spinner. This will not be used for file io because it is too quick
function loadingDone() {

    try {
        var spinner = document.getElementById("loading-spinner");
        spinner.parentNode.removeChild(spinner);
    } catch (TypeError) {
        console.log("type error")
    }
}

//Creates the loading spinner
//function createLoading() {
//    var thing = document.createElement("div")
//    thing.class = "spinner-border text-danger";
//    thing.id = "loading-spinner";
//    thing.role = "status";
//    var innerThing = document.createElement("span");
//    innerThing.class = "sr-only";
//    thing.appendChild(innerThing);
//
//    var element = document.getElementById("leaderboard-table");
//    element.appendChild(thing);
//
//}


// Adds players to the leaderboard by creating a new table row
function addPlayerToLeaderboard(player) {

    var tableRow = document.createElement("tr")

    var name = document.createElement("td");
    var roundEliminations = document.createElement("td");
    var totalEliminations = document.createElement("td");

    //sets the values to those of the player
    name.innerHTML = player['name'];
    roundEliminations.innerHTML = player['round_eliminations'];
    totalEliminations.innerHTML = player['total_eliminations'];

    //adds all three values to the table row
    tableRow.appendChild(name);
    tableRow.appendChild(roundEliminations);
    tableRow.appendChild(totalEliminations);

    var element = document.getElementById("leaderboard-table");
    element.appendChild(tableRow);
}
