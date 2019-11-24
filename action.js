let courses;
let tees;
let players = [];
let course;
let holes = [];
let courseData = [];
let teeId;
let numPlayers;
let teeName;
let scoreArray = [];


getCourses();

function getCourses(){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            mycourses = JSON.parse(this.responseText);
            console.log(mycourses)
           for(let i =0; i < mycourses.courses.length; i++){
            courses = mycourses.courses[i]
            $("#title").html("Select Your Course") 
            $("#container").append(
               `<div class="card" style="width: 18rem;">
                    <img src="${courses.image}" class="card-img-top">
                    <div class="card-body" value="${courses.id}">
                        <h5 class="card-title">${courses.name}</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <button id="courseBtn" type="button" onclick="getCourseById(${courses.id})">
                            Select Course
                        </button>
                    </div>
                </div>`
                );
           }
        }
    };
    xhttp.open("GET", "https://golf-courses-api.herokuapp.com/courses", true);
    xhttp.send();
}


function getCourseById(id) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let course = JSON.parse(this.responseText);
            holes = course.data.holes;
            courseData = course.data;
            console.log("Holes:", holes);
            console.log("Course Data:", courseData);

            loadTees();
        }
    };
    xhttp.open("GET", `https://golf-courses-api.herokuapp.com/courses/${id}`, true);
    xhttp.send();
}


function loadTees() {
    tees = courseData.holes[0].teeBoxes;
    $("#container").empty();
    for (let i = 0; i < tees.length && i < 4; i++) {
        $("#title").html(`
            <div class="courseName">${courseData.name}</div>
            <div class="question">Select Tee</div>
            `)
        $("#container").append(
            `<div class="card" style="width: 18rem;">
                <button class="teebtn" type="button" id="${tees.indexOf(tees[i])}" onclick="loadNumPlayers(${tees.indexOf(tees[i])})">
                ${tees[i].teeType}
                </button>
            </div>`);
    }
}

function loadNumPlayers(id) {
    teeId = id;
    teeName = tees[id].teeType;
    $("#container").empty();
    numPlayers = [1, 2, 3, 4];
    for (let i = 0; i < numPlayers.length; i++) {
        $("#title").html(
            `<div class="courseName">${courseData.name}</div> 
            <div class="teeName">Tee - ${tees[id].teeType}</div> 
            <div class="question">How many Players?</div>`);
        $("#container").append(
            `<div class="card" style="width: 18rem;">
                <button class="teebtn" type="button" onclick="playerNames(${numPlayers[i]})">
                ${numPlayers[i]}
                </button>
            </div>`);
    }
}

function playerNames(players) {
    numPlayers = players;
    $("#container").empty();
    for (let i = 0; i < numPlayers; i++) {
        $("#title").html(
            `<div class="courseName">${courseData.name}</div> 
            <div class="teeName">Tee - ${teeName}</div> 
            <div class="question">Enter Player Names</div>`);
        $("#container").append(
            `<form onkeypress="return event.keyCode != 13;">           
            <input type="text" class="playerInput" id="playerName${i+1}" placeholder="Player ${i+1}">
            </form>
            `
        );
    }
    $("#container").append(
        `<button class="buildbtn" type="button" onclick="addNames()">Go To Score Card</button>
        `);
}


function addNames() {

    players = [];
    let validated = true;

    $(".playerInput").each(function () {
        let value = $(this).val();
        let nameCheck = players.includes(value);
        if (value.length === 0) {
            validated = false;
            $(this).css('border', '2px solid red');
            alert("Please add all player names.");
            return false;
        }
        if (nameCheck) {
            validated = false;
            $(this).css('border', '2px solid red');
            alert(`Players cannot have the same name - ${value}`);
            return false;
        }
        else {
            players.push(value);
            
        }
    })
    buildCard();
    console.log(players);
    return validated;
    
}

function buildCard() {
    $("#container").empty();
    $("#title").html(
        `<div class="courseName">${courseData.name}</div> 
        <div class="teeName">Tee - ${teeName}</div> 
        `);
    $("#container").append(
        `<div class="scorecard">
            <div id="holes"></div>
            <div id="handicap"></div>
            <div id="yardage"></div>
            <div id="par"></div>
            <div id="players"></div>
            <div id="final"></div>
            <div id="messageBox"></div>
        </div>`);
    buildHoles();
    buildHandicap();
    buildYardage();
    buildPar();
    buildPlayer();
    buildTotalButton();
}

function buildHoles() {
    $("#holes").append(`<div class="title holes">Hole</div>`);
    for (let i = 0; i < courseData.holes.length; i++) {
        $("#holes").append(`<div class="col-sm holes" id="col_${courseData.holes[i].hole}">${i + 1}</div>`)
        if (i === 8) {
            $("#holes").append(`<div class="col-sm out">Out</div>`)
        }
        if (i === 17) {
            $("#holes").append(`<div class="col-sm in">In</div>`)
        }
    }
    $("#holes").append(`<div class="col-sm total">Total</div>`)
}

function buildHandicap() {
    let handicapTotal = 0;
    let handicapOutTotal = 0;
    let handicapInTotal = 0;
    $("#handicap").append(`<div class="title">Handicap</div>`);
    for (let i = 0; i < courseData.holes.length; i++) {
        let handicapValue = courseData.holes[i].teeBoxes[teeId].hcp;
        handicapTotal += handicapValue;
        $("#handicap").append(`<div class="col-sm" id="handicap_${i}">${handicapValue}</div>`);

        if (i < 9) {
            handicapOutTotal += handicapValue;
        }
        else {
            handicapInTotal += handicapValue;
        }
        if (i === 8) {
            $("#handicap").append(`<div class="col-sm out">${handicapOutTotal}</div>`)
        }
        if (i === 17) {
            $("#handicap").append(`<div class="col-sm in">${handicapInTotal}</div>`)
        }
    }
    $("#handicap").append(`<div class="col-sm total">${handicapTotal}</div>`)
}

function buildYardage() {
    let yardageTotal = 0;
    let yardageOutTotal = 0;
    let yardageInTotal = 0;
    $("#yardage").append(`<div class="title holes">Yardage</div>`);
    for (let i = 0; i < courseData.holes.length; i++) {
        let yardageValue = courseData.holes[i].teeBoxes[teeId].yards;
        yardageTotal += yardageValue;
        $("#yardage").append(`<div class="col-sm holes" id="yardage_${i}">${yardageValue}</div>`);

        if (i < 9) {
            yardageOutTotal += yardageValue;
        }
        else {
            yardageInTotal += yardageValue;
        }
        if (i === 8) {
            $("#yardage").append(`<div class="col-sm out">${yardageOutTotal}</div>`)
        }
        if (i === 17) {
            $("#yardage").append(`<div class="col-sm in">${yardageInTotal}</div>`)
        }
    }
    $("#yardage").append(`<div class="col-sm total">${yardageTotal}</div>`)
}

function buildPar() {
    let parTotal = 0;
    let parOutTotal = 0;
    let parInTotal = 0;
    $("#par").append(`<div class="title">Par</div>`);
    for (let i = 0; i < courseData.holes.length; i++) {
        let parValue = courseData.holes[i].teeBoxes[teeId].par;
        parTotal += parValue;
        $("#par").append(`<div class="col-sm" id="par_${i}">${parValue}</div>`);

        if (i < 9) {
            parOutTotal += parValue;
        }
        else {
            parInTotal += parValue;
        }
        if (i === 8) {
            $("#par").append(`<div class="col-sm out">${parOutTotal}</div>`)
        }
        if (i === 17) {
            $("#par").append(`<div class="col-sm in">${parInTotal}</div>`)
        }
    }
    $("#par").append(`<div class="col-sm total parTotal">${parTotal}</div>`)
}

function buildPlayer() {
    for (let i = 0; i < players.length; i++) {
        $("#players").append(`<div id="players${i}" class="player-container"><div class="playerTitle">${players[i]}</div></div>`);
        buildScore(i);
    }
}

function buildScore(index) {
    let playerIdDiv = "#players" + index;
    for (let i = 0; i < courseData.holes.length; i++) {
        $(playerIdDiv).append(`<input type="number" tabindex="${i + 2}" onkeyup="appendScores(this)" class="col-sm">`);
        if (i === 8) {
            $(playerIdDiv).append(`<div class="col-sm out"></div>`)
        }
        if (i === 17) {
            $(playerIdDiv).append(`<div class="col-sm in"></div>`)
        }
    }
    $(playerIdDiv).append(`<div class="col-sm total"></div>`);
}

function buildTotalButton() {
    $("#final").append(`<button class="finalbtn" type="button" onclick="calculateTotal()">Final Results</button>`)
}

function appendScores(event) {
    let inputId = "#" + ($(event).parent().attr("id")) + " :input";
    let totalId = "#" + ($(event).parent().attr("id")) + " .total";
    let outId = "#" + ($(event).parent().attr("id")) + " .out";
    let inId = "#" + ($(event).parent().attr("id")) + " .in";
    let total = 0;
    let outValue = 0;
    let inValue = 0;

    $(inputId).each(function (index, testVal) {
        let value = Number($(this).val());

        total += value;
        if (index <= 8) {
            let currentOutValue = Number($(this).val());
            outValue += currentOutValue;
            $(outId).text(outValue);
        }
    });
    $(totalId).text(total);
    inValue = total - outValue;
    $(inId).text(inValue);
}

function calculateTotal() {
    scoreArray = [];
    let totalPlayerScore = 0;
    let parTotal = $(".parTotal").text();
    $(".total").each(function (index) {
        let value = $(this).text();
        console.log("value:", value)
        scoreArray.push(value);
    })
    console.log(scoreArray);


    for (let i = 0; i < players.length; i++) {
        totalPlayerScore = scoreArray[i] - parTotal;
        
        
        if (totalPlayerScore >= 0 && totalPlayerScore < 5) {
            $("#messageBox").append(
                `<div class="card text-center course-select finalScoreCard">  
                    <div class="card-body">
                        <h5 class="card-title">${players[i]}</h5>
                        <p class="card-text">Your score is ${totalPlayerScore} over par, better luck next time!</p>
                    </div>
                </div>`);
        }
        if (totalPlayerScore >= 5) {
            $("#messageBox").append(
                `<div class="card text-center course-select finalScoreCard">  
                    <div class="card-body">
                        <h5 class="card-title">${players[i]}</h5>
                        <p class="card-text">Your score is ${totalPlayerScore} over par, you may need some more practice!</p>
                    </div>
                </div>`);
        }
        if (totalPlayerScore < 0) {
            $("#messageBox").append(
                `<div class="card text-center course-select finalScoreCard">  
                    <div class="card-body">
                        <h5 class="card-title">${players[i]}</h5>
                        <p class="card-text">Your score is ${totalPlayerScore} under par, great job!</p>
                    </div>
                </div>`);
        }
    }
}

