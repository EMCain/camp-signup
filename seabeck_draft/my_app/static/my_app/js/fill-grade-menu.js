/**
 * Created by Emily on 8/26/2015.
 */


graderequest = new XMLHttpRequest();


function fillGrades(){
    console.log("starting fillGrades");
    //var menus = document.getElementById("grade_field_1");
    //for(var i; i < menus.length; i++){
        //var menu = menus[i];
        var menu = document.getElementById("grade_field_1");
        for(var grade in grades_data){
            var opt = document.createElement("option");
            opt.setAttribute("value", grade.code);
            opt.innerHTML = grade.name;
            menu.appendChild(opt);
        }

    //}
}

function getGrades(){
    console.log("starting getGrades");
    window.grades_data = JSON.parse(graderequest.responseText);
    fillGrades();
}

function fetchGrades(url) { // better name??
    console.log("starting fetchGrades");
    graderequest.onreadystatechange = getGrades;
    graderequest.open("GET", url, true);
    graderequest.send();
    console.log("sent gradesrequest");
}