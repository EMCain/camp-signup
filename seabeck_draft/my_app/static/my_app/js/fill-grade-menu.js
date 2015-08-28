/**
 * Created by Emily on 8/26/2015.
 */


graderequest = new XMLHttpRequest();
var menuTimeout;

window.gradeFillNeeded = true;

function fillGrades(){
    console.log("starting fillGrades");
    window.clearTimeout(menuTimeout);
    var menus = document.getElementsByClassName("grades-menu");

    for(var i =0; i < menus.length; i++){
        var menu = menus[i];

        for(var grade_index in window.grades_data){
            var grade = window.grades_data[grade_index];
            var opt = document.createElement("option");
            opt.setAttribute("value", grade['code']);
            opt.innerHTML = grade['name'];
            menu.appendChild(opt);
        }
    }

}

function getGrades(){
    //if(window.gradeFillNeeded) {
    //    console.log("starting getGrades");
        //try {
            window.grades_data = JSON.parse(graderequest.responseText);
            window.gradeFillNeeded = false;
            fillGrades();
    //    } catch (e) {
    //        menuTimeout = window.setTimeout(getGrades, 100);
    //    }
    //}
}


function fetchGrades(url) { // better name??
    console.log("starting fetchGrades");
    graderequest.onload = getGrades;
    graderequest.open("GET", url, true);
    graderequest.send();
    console.log("sent gradesrequest");
}