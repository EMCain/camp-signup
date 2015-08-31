/**
 * Created by Emily on 8/31/2015.
 */


function callSelectGrade() { //more descriptive name
    console.log(request.readyState, request.status);
    if ((request.readyState == 4) && (request.status == 200)) {
        console.log("selectGrade successfully starting")
        window.campers_grade_data = JSON.parse(request.responseText); //TODO more descriptive. make a separate function
        // todo change var campers_data to window.campers
        console.log(window.campers_grade_data);
        selectGrade();
    }
}

//selectGrade
//loops through grade menus in page
//for each camper, selects that camper's grade and sets the relevant option to "selected"
//also calls addGradeListener on each menu

function selectGrade() {
    var grade_menus = document.getElementsByClassName("grades-menu");
    for(var i = 0; i < grade_menus.length; i++){
        var menu = grade_menus[i];
        var id = menu.getAttribute("data-id");
        var camper = getCamperById(id);
        var camper_grade = camper["grade_code"];
        var options = menu.childNodes;
        for(var j = 0; j < options.length; j++){
            var option = options[j];
            if(camper_grade == option.getAttribute("value"))
             {
                 option.setAttribute("selected", "selected");
             }
        }
        menu.addEventListener("change", onChangeGrade);
    }
}



//onChangeGrade
//finds "this" element
//determines which grade is selected
//calls "update camper" (from other js file)

function onChangeGrade(e) {
    var id = this.getAttribute("data-id");
    var camper = getCamperById(id);
    camper["grade_code"] = this.value;//fix this
    saveCamper(camper, "update");
}


//addGradeListener(element)
//adds a listener with "change"  as the trigger and "onChangeGrade" as the function

function fetchCampersGrade() { // better name??
    request.onreadystatechange = callSelectGrade;
    request.open("GET", "/api_campers/", true);
    request.send();
}