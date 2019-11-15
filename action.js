let mycourses;
let myclass

(function() {
    getCourses ();
})();

function getCourses(){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            mycourses = JSON.parse(this.responseText);
            console.log(mycourses)
           for(let i =0; i < mycourses.courses.length; i++){
               $("#courses").append(
               `<div class="card" style="width: 18rem;">
                    <img src="${mycourses.courses[i].image}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${mycourses.courses[i].name}</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                            Select Course
                        </button>
                    </div>
                </div>
                
                <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>`);
           }
        }
    }
    xhttp.open("GET", "https://golf-courses-api.herokuapp.com/courses", true);
    xhttp.send();
}



function getCourseInfo(id){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            let myclass = JSON.parse(this.responseText);
            // console.log(myclass);

            // console.log($(el).parent().find(".levels"));
    
            for(let l = 0; l < myclass.classes[0].levels.length; l++){
                // console.log
            $(el).parent().find(".levels").append(`<div onclick="showclass(${l})">
                                        <span>${myclass.classes[0].levels[l].type}</span>
                                        </div>`);
            }
        }
    }
    xhttp.open("GET", `https://golf-courses-api.herokuapp.com/courses/${id}`, true);
    xhttp.send();
}

function showclass(ctype){
    for(let c = 0; c < myclass.classes.length; c++) {
        $(".classlist").append(`<div>
                                    <span>${myclass.classes[c].classname}</span>
                                    <span>${myclass.classes[c].levels[ctype].teacher}</span>
                                    <span>${myclass.classes[c].levels[ctype].schedule}</span>
                                    </div>`);
    }
}
