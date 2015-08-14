var request = new XMLHttpRequest();

function draw(data) {
    console.log(data);

    //finds the div that we will be putting the data in

    var listdiv = document.getElementById("campers-list");

    //writes the input string "data" to the inside of the div. The line break may not be necessary.

    listdiv.innerHTML = "<br>\n" + data;
}

function fillFormSections(camperid) {

    //this function inserts form elements into a given camper's section. Uses 'addon' spans as the direct
    //parent--this is a Bootstrap feature that causes form elements and labels to line up nicely.

    //by the time this is called, the parent elements have already been created.
    //still need to implement GET and POST functions -- right now it just creates an inert form.
    console.log("fillFormSections starting");
    var id = camperid;

    // food questions section

    var food_div = document.getElementById("food_div_" + id); // TODO find where this is supposed to be used

    // food_div.style.display = "none";

    //TODO turn this into a function that takes a dict/'object' and iterates over this stuff
    //TODO create a second function to generate the above mentioned object

    //TODO may want to add listeners when doing the above

    console.log("creating vegetarian box")
    var vegetarian = document.createElement("INPUT");
    vegetarian.setAttribute("type", "checkbox");
    vegetarian.setAttribute("id", "vegetarian_" + id);
    vegetarian.setAttribute("class", "diet_form_" + id);

    //not sure if this is the best way to assign classes to elements. Will depend on how they are used.
    //todo figure out how forms will be used for POST request and make sure the attributes are useful for that
    console.log("appending vegetarian box to vegetarian addon")
    document.getElementById("vegetarian_addon_" + id).appendChild(vegetarian);

    var vegan = document.createElement("INPUT");
    vegan.setAttribute("type", "checkbox");
    vegan.setAttribute("id", "vegan_" + id);
    vegan.setAttribute("class", "diet_form_" + id);

    document.getElementById("vegan_addon_" + id).appendChild(vegan);

    var gf = document.createElement("INPUT");
    gf.setAttribute("type", "checkbox");
    gf.setAttribute("id", "gf_" + id);
    gf.setAttribute("class", "diet_form_" + id);

    document.getElementById("gf_addon_" + id).appendChild(gf);

    var df = document.createElement("INPUT");
    df.setAttribute("type", "checkbox");
    df.setAttribute("id", "df_" + id);
    df.setAttribute("class", "diet_form_" + id);

    document.getElementById("df_addon_" + id).appendChild(df);

    // age questions section--only applies to campers under 18.

    var age_div = document.getElementById("age_div_" + id);

    //age_div.style.display = "none";

    var dob = document.createElement("INPUT");
    dob.setAttribute("type", "date");
    dob.setAttribute("id", "dob_" + id);
    dob.setAttribute("class", "diet_form_" + id);

    document.getElementById("dob_addon_" + id).appendChild(dob);

    var grade = document.createElement("INPUT");
    grade.setAttribute("type", "text");
    grade.setAttribute("id", "grade_" + id);
    grade.setAttribute("class", "diet_form_" + id);

    document.getElementById("grade_addon_" + id).appendChild(grade);

    var sponsor = document.createElement("INPUT");
    sponsor.setAttribute("type", "text");
    sponsor.setAttribute("id", "gf_" + id);
    sponsor.setAttribute("class", "diet_form_" + id);

    document.getElementById("sponsor_addon_" + id).appendChild(sponsor);

    console.log("fillFormSections ending");
}



function addElementListener(camper, el) { // takes element as input

    var update = {"dob": camper.dob};

    el.addEventListener("change", function(e) {
        var value = e.target.value;
        var field_name = e.target.name;
        update[field_name] = value;
        el.value = value;

        sendPost(update, "/update_camper/");
    });

}

function onRequestChange() { //more descriptive name
    console.log(request.readyState, request.status);
    if ((request.readyState == 4) && (request.status == 200)) {
        console.log("onRequestChange successfully starting")
        var data = JSON.parse(request.responseText); //TODO more descriptive
        console.log(data);

        var cof_container = document.createElement("div");
        cof_container.setAttribute("class", "container");
        cof_container.setAttribute("id", "campers_of_family");
        document.getElementById("campers-list").appendChild(cof_container); // should name this better

        //this for loop writes the html for each camper's summary line and form elements

        for (var item in data) { // TODO better name for item
            //camper's id number will be used to construct DOM elements' id attributes

            var id = data[item].id.toString();

            console.log("beginning for loop with camper id " + id);

            //creates an inner div called "camper_info," sets attributes, sticks it into the outer cof_container div
            // Assigns to "active" if there is an attendance record associated with that camper
            // for the latest year.

            console.log("creating camper-info div for camper " + id);
            var camper_info = document.createElement("div");
            camper_info.setAttribute("id", "camper_info_" + id);
            if (data[item].in_current_year) {
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
            var static_name_string = data[item].name;

            static_name_string += " - ";

            //depending on whether the person is attending, makes it say "attending" or "not attending"

            if (!data[item].in_current_year) {
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


            console.log("assigning button text");
            if (data[item].in_current_year) {
                attend_status_button.innerHTML = "Remove"; //+ current_year // find this out and create
            } else {
                attend_status_button.innerHTML = "Sign up"; //+ current_year
            }

            buttons_column.appendChild(attend_status_button);

            // ends 1) the col-md-2 div 2) the row div


            //creates the food form section. Will eventually create a name change section above that
            //also allows you to check boxes for "food preferences" and "under 18" that will
            // bring up the following two sections if needed. These forms don't do anything yet.


            var food_row = document.createElement("div");
            food_row.setAttribute("class", "row");
            food_row.setAttribute("id", "food_row_" + id);
            camper_info.appendChild(food_row)


            var food_needs = ["vegetarian", "vegan", "gf", "df"];
            var food_needs_labels = ["vegetarian", "vegan", "gluten free", "dairy free"];

            for (var i = 0; i < food_needs.length; i++) {
                var need = food_needs[i];

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
                fn_label.innerHTML = food_needs_labels[i];
                inp_gr.appendChild(fn_label);
                // pick up again here; remove next section when done


                var check_box_addon = document.createElement("span");
                check_box_addon.setAttribute("class", "input-group-addon");
                inp_gr.appendChild(check_box_addon);


                console.log("creating check box")
                var check_box = document.createElement("INPUT");
                check_box.setAttribute("type", "checkbox");
                check_box.setAttribute("id", need + "_" + id);
                check_box.setAttribute("class", "input-group-addon");

                check_box.checked = data[item]["is_" + need];
                // takes the boolean value from is_vegetarian etc and uses it to set the checkbox to checked or not checked


                //not sure if this is the best way to assign classes to elements. Will depend on how they are used.
                //todo figure out how forms will be used for POST request and make sure the attributes are useful for that
                console.log("appending checkbox to addon");
                check_box_addon.appendChild(check_box);

            }


            //creates the form section with questions about minors

            var age_div = document.createElement("div");
            age_div.setAttribute("class", "row");
            age_div.setAttribute("id", "food_div_" + id);

            camper_info.appendChild(age_div);

            var age_qs = ["dob", "grade", "sponsor", "sponsor_phone"] // eventually will want to make this a
            // hash with field: input type
            //dob will be date, grade will be a dropdown list generated from a "grades" table
            //

            var age_q_labels = ["Date of Birth", "Grade (starting Fall)", "Responsible Adult", "Adult's Phone"] // eventually fill in event year and registrant name

            for (var i = 0; i < age_qs.length; i++) {
                var question = age_qs[i];

                var q = document.createElement("div");
                q.setAttribute("class", "col-md-3");//does it make sense to make this an input group????
                q.setAttribute("id", question + "_col_" + id);
                age_div.appendChild(q);

                inp_gr = document.createElement("div");
                inp_gr.setAttribute("class", "input-group");
                q.appendChild(inp_gr);

                var age_label = document.createElement("span");
                age_label.setAttribute("class", "input-group-addon");
                age_label.setAttribute("id", "input-group-addon");
                age_label.innerHTML = age_q_labels[i]; //eventually change to using a different more readable set of labels
                inp_gr.appendChild(age_label);

                var text_input = document.createElement("INPUT");
                text_input.setAttribute("type", "text");
                text_input.setAttribute("id", question + "_field_" + id);
                text_input.setAttribute("class", "form-control");
                text_input.setAttribute("name", question);

                inp_gr.appendChild(text_input);

                if (question == "dob") {
                    addElementListener(data[item], text_input);
                }
            }

            var current_element = document.getElementById("dob_field_1");

            current_element.value = data[item]["dob"];
            //fillFormSections(id);



        }


    }


}


//function addElementListener(item, el) { // takes element as input
//
//    var update = {"dob": data[item].dob};
//
//    el.addEventListener("change", function(e) {
//        var value = e.target.value;
//        var field_name = e.target.name;
//        update[field_name] = value;
//        el.value = value;
//
//        sendPost(update, "/update_camper/")
//    });
//
//}

//function addProfileListeners() {
//    var profile = document.getElementById("profile");
//    var edit_fields = profile.getElementsByClassName('edit_field');
//    var update = {"user_id": DM.user_id};
//
//    for (i = 0; i < edit_fields.length; i++) {
//        current_field = edit_fields[i];
//        current_field.addEventListener("change", function(e) {
//            var value = e.target.value;
//            var field_name = e.target.name;
//            update[field_name] = value;
//            profile.getElementsByClassName(field_name)[0].innerText = value;
//
//            sendPost(update, "/update_profile/")
//        });
//    }
//
//
//
//}


function populateFields(type, id) {

    var item = document.getElementById(type + "_field_" + id);


}


function fetch(url) { // better name??
    request.onreadystatechange = onRequestChange;
    request.open("GET", url, true);
    request.send();
}





/**
 * Created by Emily on 8/6/2015.
 */
