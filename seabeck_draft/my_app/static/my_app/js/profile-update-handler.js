/**
 * Created by Emily on 9/1/2015.
 */


window.inputs = document.getElementsByClassName("form-control");
var profileRequest = new XMLHttpRequest();

//function to send request that's triggered by change

//function to loop through inputs
//fill with data
//adds event listener to each input

function onProfileRequestChange() {

    if ((profileRequest.readyState == 4) && (profileRequest.status == 200)) {
        window.profile_data = JSON.parse(profileRequest.responseText);

        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            var fieldname = input.name;
            input.value = window.profile_data[0][fieldname];
            input.addEventListener("change", onChange);
        }
    }
}

function onChange(e){
    var name = this.name;
    var value = this.value;
    var fd = new FormData();

    fd.append(name, value);

    var saveRequest = new XMLHttpRequest();
    saveRequest.open("POST", "/update_family/", true);
    saveRequest.send(fd);
}


//fetch function
//calls index api (??)

function fetchProfile(url) {
    profileRequest.onreadystatechange = onProfileRequestChange;
    profileRequest.open("GET", url, true);
    profileRequest.send();
}