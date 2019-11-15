let numplayers = 0;
let numholes = 18;
let allcourses;
let mycourse;
let mytee;

loadDoc();
function loadDoc(){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            allcourses = JSON.parse(this.responseText);
            for(let i = 0; i <allcourses.courses.length; i++) {
                $("#mycourses").append(`<option value=:${allcourses.courses[i].id}`)// not finished

            }
        }
    };
    xhttp.open("GET", "https://golf-courses-api.herokuapp.com/courses", true);
    xhttp.send();
}


function getcourse(){

}

function setTee(teeid){
    mytee = teeid;
    buildcol();
}

function buildcol(){
    for(let c = 0; c < numholes; c++) {
        $(".box").append(`<div id="col${c}" class="column"><div>${c}</div></div>`);
    }
}

function buildholes(){
    for(let h = 1; h <= numholes; h++){
        $("#col" + h).append(`input id="p${numplayers}h${h}" class="minibox">`);
    }
    $(".minibox").keyup(function(){
        console.log($(this.attr("id"));
    });
}


function addplayer(){
    numplayers++;
    buildholes();
    $(".namelist").append(`<div class="namebox" contenteditable="true">Random Name</div>`);
}