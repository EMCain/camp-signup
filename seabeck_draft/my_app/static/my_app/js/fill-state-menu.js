/**
 * Created by Emily on 8/19/2015.
 */
var states_menu = document.getElementById("states-menu");

var states_list = {"AL": "Alabama",
           "AK": "Alaska",
           "AZ": "Arizona",
           "AR": "Arkansas",
           "CA": "California",
           "CO": "Colorado",
           "CT": "Connecticut",
           "DE": "Delaware",
           "DC": "District Of Columbia",
           "FL": "Florida",
           "GA": "Georgia",
           "HI": "Hawaii",
           "ID": "Idaho",
           "IL": "Illinois",
           "IN": "Indiana",
           "IA": "Iowa",
           "KS": "Kansas",
           "KY": "Kentucky",
           "LA": "Louisiana",
           "ME": "Maine",
           "MD": "Maryland",
           "MA": "Massachusetts",
           "MI": "Michigan",
           "MN": "Minnesota",
           "MS": "Mississippi",
           "MO": "Missouri",
           "MT": "Montana",
           "NE": "Nebraska",
           "NV": "Nevada",
           "NH": "New Hampshire",
           "NJ": "New Jersey",
           "NM": "New Mexico",
           "NY": "New York",
           "NC": "North Carolina",
           "ND": "North Dakota",
           "OH": "Ohio",
           "OK": "Oklahoma",
           "OR": "Oregon",
           "PA": "Pennsylvania",
           "RI": "Rhode Island",
           "SC": "South Carolina",
           "SD": "South Dakota",
           "TN": "Tennessee",
           "TX": "Texas",
           "UT": "Utah",
           "VT": "Vermont",
           "VA": "Virginia",
           "WA": "Washington",
           "WV": "West Virginia",
           "WI": "Wisconsin",
           "WY": "Wyoming"};

function fillMenu(state_value){
    console.log("filling menu...");
  for (var abbrev in states_list) {
    var option = document.createElement("OPTION");
    option.setAttribute("value", abbrev);
    option.innerHTML = states_list[abbrev];
    if (state_value == abbrev) {//define state_value
      option.setAttribute("selected", "true");
    }
    console.log("adding option for " + abbrev);
    states_menu.appendChild(option);
  }
    states_menu.addEventListener("change", onSelectState)
}

function onSelectState(e) {
    var selected = this.value;
    //send selected to update_family
    //need to change update_family to a conditional loop
    //try with update_camper first

}

function fetchFamily(){}//need to create an api family