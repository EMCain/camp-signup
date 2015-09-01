/**
 * Created by Emily on 8/26/2015.
 */


graderequest = new XMLHttpRequest();
//var menuTimeout;


function fillGrades(){
    console.log("starting fillGrades");
    //window.clearTimeout(menuTimeout);
    var menus = document.getElementsByClassName("grades-menu");

    for(var i =0; i < menus.length; i++){
        var menu = menus[i];

        for(var j = 0; j < window.grades_data.length; j++){
            var grade = window.grades_data[j];
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
            fillGrades();
            fetchCampersGrade(); //not sure if this is the right place
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