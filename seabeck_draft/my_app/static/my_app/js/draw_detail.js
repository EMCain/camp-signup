var request = new XMLHttpRequest();
//var grades_request = new XMLHttpRequest();

function getCamperById(id) {
    for (var i = 0; i < window.campers_data.length; i++) {
        var camper = window.campers_data[i];
        if (camper.id == id) {
            return camper;
        }
    }
}

function changeAttendanceStatus(e) {
    var id = this.getAttribute("data-id");
    var camper = getCamperById(id);
    saveCamper(camper, "changeAtnd");
}

function saveCamper(camper, action) {

    var fd = new FormData();

    if (action == "update") {

        var url = "/update_camper/";

        for (var property in camper) {
            fd.append(property, camper[property]);
        }
    }
    if (action == "changeAtnd") { // currently this ONLY

        var url = "/change_attendance/";


        if (camper["in_current_year"]) {
            fd.append("will_attend", "0"); // i.e. false; we are changing it so they will NOT attend
            fd.append("id", camper.id);
        } else {
            fd.append("will_attend", "1"); // won't attend --> will attend
            var props = ["id", "sponsor_name", "sponsor_phone"];

            for (i in props) {
                fd.append(props[i], camper[props[i]]);
            }
        }
    }

    var saveRequest = new XMLHttpRequest();
    saveRequest.open("POST", url, true);


    if (action == "changeAtnd") {
        saveRequest.onload = fetchCampers
    }

    saveRequest.send(fd);


}


function fetchCampers(e) {

    fetch("/api_campers/");

}


function onChange(e) {

    var value = e.target.value;
    var field_name = e.target.name;
    var id = e.target.getAttribute("data-id")
    var camper = getCamperById(id);

    if (field_name.indexOf("dob") > -1) {
        camper.dob = value;
    }
    if (field_name.indexOf("sponsor_phone") > -1) {
        camper.sponsor_phone = value;
    }
    if (field_name.indexOf("sponsor_name") > -1) {
        camper.sponsor_name = value;
    }


    saveCamper(camper, "update");
}
//checkbox change event

function onCheck(e) {
    console.log(e.target);

    var value = e.target.checked;
    var field_name = e.target.name;
    var id = e.target.getAttribute("data-id");
    var camper = getCamperById(id);
    var box_class = e.target.classList;

    console.log(box_class);

    if (box_class.contains("vegetarian_checkbox")) {
        console.log("contains vegetarian");
        camper.is_vegetarian = value;
    } else if (box_class.contains("vegan_checkbox")) {
        console.log("contains vegan");
        camper.is_vegan = value;
    } else if (box_class.contains("gf_checkbox")) {
        console.log("contains gf");
        camper.is_gf = value;
    } else if (box_class.contains("df_checkbox")) {
        console.log("contains df");
        camper.is_df = value;
    }


    saveCamper(camper, "update");


}


//todo make these into one function
function addElementListener(camper, el) { // takes element as input

    //var update = {"dob": camper.dob};

    el.addEventListener("change", onChange);

}

function addCheckboxListener(camper, el) {

    console.log(el);

    var question_type = el.class;

    var update = {};


    // this could be done with a loop
    if (el.classList.contains('vegetarian_checkbox')) {
        update = {"vegetarian": camper.is_vegetarian};
    }
    if (el.classList.contains('vegan_checkbox')) {
        update = {"vegan": camper.is_vegan};
    }
    if (el.classList.contains('gf_checkbox')) {
        update = {"gf": camper.is_gf};
    }
    if (el.classList.contains('df_checkbox')) {
        update = {"df": camper.is_df};
    }

    el.addEventListener("change", onCheck);

}


function onRequestChange() { //more descriptive name
    console.log(request.readyState, request.status);
    if ((request.readyState == 4) && (request.status == 200)) {
        console.log("onRequestChange successfully starting")
        window.campers_data = JSON.parse(request.responseText); //TODO more descriptive. make a separate function
        // todo change var campers_data to window.campers
        console.log(window.campers_data);
        drawCampers();
        fetchGrades("/api_grades/");
    }
}


function drawCampers() { //separate out the drawing of a given camper as a separate function
    //then call that function when an attendence is added/removed

    var listdiv = document.getElementById("campers-list");
    listdiv.innerHTML = "";

    var cof_container = document.createElement("div");
    cof_container.setAttribute("class", "container");
    cof_container.setAttribute("id", "campers_of_family");

    listdiv.appendChild(cof_container); // should name this better

    //this for loop writes the html for each camper's summary line and form elements

    for (var i = 0; i < window.campers_data.length; i++) { // TODO better name for item
        //camper's id number will be used to construct DOM elements' id attributes

        var camper = window.campers_data[i];

        var id = camper.id;  //for some reason this is trying to draw grades??

        console.log("beginning for loop with camper id " + id);

        //creates an inner div called "camper_info," sets attributes, sticks it into the outer cof_container div
        // Assigns to "active" if there is an attendance record associated with that camper
        // for the latest year.

        console.log("creating camper-info div for camper " + id);
        var camper_info = document.createElement("div");
        camper_info.setAttribute("id", "camper_info_" + id);
        if (window.campers_data[i].in_current_year) {
            camper_info.setAttribute("class", "camper-info active");
        } else {
            camper_info.setAttribute("class", "camper-info inactive");
        }
        camper_info.setAttribute("data-id", id);
        cof_container.appendChild(camper_info);


        //creates the row that has the camper's name, whether they are attending,
        // and the buttons to edit, delete and register/unregister for this year.
        //still need to add the other buttons and make the buttons do things.

        console.log("creating static name row");
        var static_name_row = document.createElement("div");
        static_name_row.setAttribute("id", "static_name_row_" + id);
        static_name_row.setAttribute("class", "row");
        camper_info.appendChild(static_name_row);

        console.log("creating large column")
        var static_name_column = document.createElement("div");
        static_name_column.setAttribute("class", "col-md-5");
        static_name_row.appendChild(static_name_column);

        //declaring string static_name_string here for the static row
        var static_name_string = window.campers_data[i].name;

        static_name_string += " - ";

        //depending on whether the person is attending, makes it say "attending" or "not attending"

        if (!window.campers_data[i].in_current_year) {
            static_name_string += " not";
        }

        static_name_string += " attending this year ";

        static_name_column.innerHTML = static_name_string;
        console.log("put the string into the innerhtml");//this successfully happens, then what??

        //assigns button text depending on what it will do

        var buttons_column = document.createElement("div");
        buttons_column.setAttribute("class", "col-md-5");
        static_name_row.appendChild(buttons_column);

        console.log("creating button");
        var attend_status_button = document.createElement("button");
        attend_status_button.setAttribute("data-id", id);


        console.log("assigning button text");
        if (window.campers_data[i].in_current_year) {
            attend_status_button.innerHTML = "Remove"; //+ current_year // find this out and create
        } else {
            attend_status_button.innerHTML = "Sign up"; //+ current_year
        }

        attend_status_button.addEventListener("click", changeAttendanceStatus);

        buttons_column.appendChild(attend_status_button);


        //creates the food form section. Will eventually create a name change section above that


        var food_row = document.createElement("div");
        food_row.setAttribute("class", "row food-row");
        food_row.setAttribute("id", "food_row_" + id);
        camper_info.appendChild(food_row)


        var food_needs = ["vegetarian", "vegan", "gf", "df"];
        var food_needs_labels = ["vegetarian", "vegan", "gluten free", "dairy free"];

        for (var j = 0; j < food_needs.length; j++) {
            var need = food_needs[j];

            var fn = document.createElement("div");
            fn.setAttribute("class", "col-md-3");//does it make sense to make this an input group????
            fn.setAttribute("id", need + "_col_" + id);
            food_row.appendChild(fn);

            var inp_gr = document.createElement("div");
            inp_gr.setAttribute("class", "input-group");
            fn.appendChild(inp_gr);

            var fn_label = document.createElement("span");
            fn_label.setAttribute("class", "input-group-addon");
            fn_label.setAttribute("id", "input-group-addon");
            fn_label.innerHTML = food_needs_labels[j];
            inp_gr.appendChild(fn_label);


            var check_box_addon = document.createElement("span");
            check_box_addon.setAttribute("class", "input-group-addon");
            inp_gr.appendChild(check_box_addon);


            console.log("creating check box")
            var check_box = document.createElement("INPUT");
            check_box.setAttribute("type", "checkbox");
            check_box.setAttribute("id", need + "_" + id);
            check_box.setAttribute("class", "input-group-addon " + need + "_checkbox");
            check_box.setAttribute("data-id", id);

            check_box.checked = window.campers_data[i]["is_" + need];
            // takes the boolean value from is_vegetarian etc and uses it to set the checkbox to checked or not checked


            //not sure if this is the best way to assign classes to elements. Will depend on how they are used.
            //todo figure out how forms will be used for POST request and make sure the attributes are useful for that
            console.log("appending checkbox to addon");

            addCheckboxListener(window.campers_data[i], check_box);

            check_box_addon.appendChild(check_box);

        }


        //creates the form section with questions about minors

        var age_div = document.createElement("div");
        age_div.setAttribute("class", "row age-row");
        age_div.setAttribute("id", "age_div_" + id);

        camper_info.appendChild(age_div);

        var age_qs = ["grade", "dob", "sponsor_name", "sponsor_phone"] // eventually will want to make this a
        // hash with field: input type
        //dob will be date, grade will be a dropdown list generated from a "grades" table
        //

        var age_q_labels = ["Grade", "Date of Birth", "Responsible Adult", "Adult's Phone"] // eventually fill in event year and registrant name

        for (var k = 0; k < age_qs.length; k++) {
            var question = age_qs[k];

            var q = document.createElement("div");
            q.setAttribute("class", "col-md-3");//does it make sense to make this an input group????
            q.setAttribute("id", question + "_col_" + id);
            age_div.appendChild(q);

            inp_gr = document.createElement("div");
            inp_gr.setAttribute("class", "input-group");
            q.appendChild(inp_gr);

            var age_label = document.createElement("span");
            age_label.setAttribute("class", "input-group-addon");
            age_label.setAttribute("id", "input-group-addon-" + id);
            age_label.innerHTML = age_q_labels[k]; //eventually change to using a different more readable set of labels
            inp_gr.appendChild(age_label);


            if (question == "grade") {
                var age_input = document.createElement("SELECT");
                age_input.setAttribute("id", question + "_field_" + id);
                //age_input.setAttribute("class", "form-control");
                age_input.setAttribute("name", question);
                age_input.setAttribute("data-id", id);
                age_input.setAttribute("class", "grades-menu");
            } else {

                var age_input = document.createElement("INPUT");
                age_input.setAttribute("type", "text");
                age_input.setAttribute("id", question + "_field_" + id);
                age_input.setAttribute("class", "form-control");
                age_input.setAttribute("name", question);
                age_input.setAttribute("data-id", id);
            }

            inp_gr.appendChild(age_input);

            if (question == "dob" || question == "sponsor_name" || question == "sponsor_phone") {
                addElementListener(camper, age_input); //what is camper doing here??
                age_input.setAttribute("value", camper[question]);
            }
        }

        //var current_element = document.getElementById("dob_field_1");
        //
        //current_element.value = window.campers_data[item]["dob"];


    }


}


function fetch(url) { // better name??
    request.onreadystatechange = onRequestChange;
    request.open("GET", url, true);
    request.send();
}


//function fetchGradesThing(url) {
//    grades_request.onreadystatechange = fillGrades;
//    grades_request.open("GET", url, true);
//    grades_request.send();
//}

/**
 * Created by Emily on 8/6/2015.
 */
