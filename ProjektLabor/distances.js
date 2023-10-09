//beállít button
/*
function setPlace()
{
    pos1=document.getElementById("pInput_1");
    pos2=document.getElementById("pInput_2");
    console.log(pos1);
    console.log(pos2);
}     
*/






// Initialize and add the map

/*GLOBÁLIS VÁLTOZÓK
-----------------------------------------------
*/
var map;
var mk1, mk2;
var polyline=null;
/*
-----------------------------------------------
*/
function haversine_distance(mk1, mk2) {
var R = 3958.8; // Radius of the Earth in miles
var rlat1 = mk1.position.lat() * (Math.PI/180); // Convert degrees to radians
var rlat2 = mk2.position.lat() * (Math.PI/180); // Convert degrees to radians
var difflat = rlat2-rlat1; // Radian difference (latitudes)
var difflon = (mk2.position.lng()-mk1.position.lng()) * (Math.PI/180); // Radian difference (longitudes)

var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
d=d*1.609344;
return d;
}
function initMap() {


    // The map, centered on Ajka
    const center = {lat: 47.10558322865701,  lng: 17.561561846697302};
    const options = {zoom: 10, scaleControl: true, center: center};
    map = new google.maps.Map(
        document.getElementById('map'), options);
    // Locations of marks
    const pos1 = {lat: 47.105388, lng: 17.561298};
    const pos2 = {lat: 47.089476, lng: 17.907621};
    // The markers
    mk1 = new google.maps.Marker({position: pos1, map: map, draggable: true});
    mk2 = new google.maps.Marker({position: pos2, map: map, draggable: true});
    console.log(mk1);
    console.log(mk2);
    
}

function calc() {
// Check if a polyline exists and remove it from the map
    if (polyline !== null) {
        polyline.setMap(null);
    }

var pos1=mk1.getPosition();
console.log(pos1);
var pos2=mk2.getPosition();
console.log(pos2);

    // Draw a line showing the straight distance between the markers

polyline = new google.maps.Polyline({path: [pos1, pos2], map: map});
// Calculate and display the distance between markers
var distance = haversine_distance(mk1, mk2);
document.getElementById('msg').innerHTML = "Distance between markers: " + distance.toFixed(2) + " km.";
}