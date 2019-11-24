  
class Player {
  constructor(name) {
      this.name = name;
      this.holeScore = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      this.totalScore = ()=>{return this.holeScore.reduce((a, b) => a + b, 0)};
      this.outScore = ()=>{return this.holeScore.slice(0,9).reduce((a,b) => a + b, 0)};
      this.inScore = () =>{return this.holeScore.slice(9, 18).reduce((a, b) => a + b, 0)};
  }
}
let tees;
let players = [];
let idPromise;
let tee;
let teeList = [];
let course;
let holesList =[];
let holeYards = [];
let holeCap = []; 
let holePar = [];
let holes = [];
let courseData = [];
let teeIndex;
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
            $("#title").html("Select Your Course") 
            $("#container").append(
               `<div class="card" style="width: 18rem;">
                    <img src="${mycourses.courses[i].image}" class="card-img-top">
                    <div class="card-body" value="${mycourses.courses[i].id}">
                        <h5 class="card-title">${mycourses.courses[i].name}</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <button type="button" onclick="getCourseById(${mycourses.courses[i].id})">
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
        $("#title").html(`${courseData.name}`)
        $("#container").append(
            `<div class="card" style="width: 18rem;">
                <button type="button" id="${tees.indexOf(tees[i])}" onclick="loadNumPlayers(${tees.indexOf(tees[i])})">
                ${tees[i].teeType}
                </button>
            </div>`);
    }
}

function loadNumPlayers(id) {
    teeIndex = id;
    teeName = tees[id].teeType;
    $("#container").empty();
    numPlayers = [1, 2, 3, 4];
    for (let i = 0; i < numPlayers.length; i++) {
        $("#title").html(
            `<div>${courseData.name}</div> 
            <div>Tee - ${tees[id].teeType}</div> 
            <div>How many Players?</div>`);
        $("#container").append(
            `<div class="card" style="width: 18rem;">
                <button type="button" onclick="playerNames(${numPlayers[i]})">
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
            `<div>${courseData.name}</div> 
            <div>Tee - ${teeName}</div> 
            <div>Enter Player Names</div>`);
        $("#container").append(
            `<form onkeypress="return event.keyCode != 13;">           
            <input type="text" class="playerNameInput" id="playerName${i+1}" placeholder="Player ${i+1}">
            </form>
            `
        );
    }
    $("#container").append(
        `<button type="button" onclick="addNames()">Go To Score Card</button>
        `);
}


function addNames() {

    players = [];
    let validated = true;

    $(".playerNameInput").each(function () {
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
            players.push(new Player(value));
            
        }
    })
    buildCard();
    console.log(players);
    return validated;
    
}

function buildCard() {
    $("#container").empty();
    $("#title").html(
        `<div>${courseData.name}</div> 
        <div>Tee - ${teeName}</div> 
        `);
    $("#container").append(
        `<div class="scorecard-container">
            <div id="holes"></div>
            <div id="par"></div>
            <div id="yardage"></div>
            <div id="handicap"></div>
            <div id="play"></div>
        </div>`);
    buildHoles();
    buildPar();
    buildYardage();
    buildHandicap();
    buildPlayer();
    buildTotalButton();
}

