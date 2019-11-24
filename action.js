  
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
let playerCount;
let teeName;
let nameArray = [];
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
            $("#courses").append(
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
    $("#courses").empty();
    for (let i = 0; i < tees.length && i < 4; i++) {
        $("#title").html(`${courseData.name}`)
        $("#courses").append(
            `<div class="card text-center course-select">  
             <div class="card-body">
             <h5 class="card-title">${tees[i].teeType}</h5>
             <button class="btn btn-dark text-center" id="${tees.indexOf(tees[i])}" onclick="choosePlayerCount(${tees.indexOf(tees[i])})">Select</button>
             </div></div>`);
    }

}






