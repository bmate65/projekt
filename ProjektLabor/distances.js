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
var elevator;
var marker1=null, marker2=null;
var pos1, pos2;
var polyline=null;
var markerCount=0;
//var segmentDivider=1;//km
var positions = []; //positions array

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
/*
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
*/
 //initialize elevation service
function initMap() {
    // The map, centered on Ajka
    const center = {lat: 47.10558322865701, lng: 17.561561846697302};
    const options = {zoom: 10, scaleControl: true, center: center};
    map = new google.maps.Map(
        document.getElementById('map'), options);
        
    
        
    // Add a click event handler to the map
    map.addListener('click', function(event) {
        // Check if a polyline exists and remove it from the map
        if (polyline !== null) {
            polyline.setMap(null);
        }

        // Check if the maximum number of markers has been reached
        if (markerCount >= 2) {
            alert('You can only create 2 markers.');
            return;
        }

        // Create a new marker at the clicked location
        var marker = new google.maps.Marker({
            position: event.latLng,
            map: map,
            draggable: true
        });

        // Increment the marker counter
        markerCount++;
        // If this is the first marker, set it as mk1
        if (marker1 === null) {
            marker1 = marker;
            console.log(marker);
        }
        // If this is the second marker, set it as mk2 and calculate the distance
        else if (marker2 === null) {
            marker2 = marker;
            console.log(marker);
        }
    });
    elevator = new google.maps.ElevationService;
    
}

function calc() {
    // Check if both markers are defined
    if (marker1 !== null && marker2 !== null) {
        pos1 = marker1.getPosition();
        console.log(pos1);
        pos2 = marker2.getPosition();
        console.log(pos2);
        if(polyline!==null)
            {
                polyline.setMap(null);
            }
        
        // Draw a line showing the straight distance between the markers
        polyline = new google.maps.Polyline({path: [pos1, pos2], map: map});

        // Calculate and display the distance between markers
        var distance = haversine_distance(marker1, marker2);
        document.getElementById('msg').innerHTML = "Distance between markers: " + distance.toFixed(2) + " km.";
    } else {
        alert("Please place two markers on the map before calculating the distance.");
    }
}

function divideLineIntoKm() {
    if (marker1 !== null && marker2 !== null) {
        var pos1 = marker1.getPosition();
        var pos2 = marker2.getPosition();

        var distance = haversine_distance(marker1, marker2);

        
        if(positions.length>0){
            positions.length=0;
        }
        for (var i = 0; i <= distance; i++) {
            var fraction = i / distance;

            var lat = pos1.lat() + (pos2.lat() - pos1.lat()) * fraction;
            var lng = pos1.lng() + (pos2.lng() - pos1.lng()) * fraction;

            positions.push(new google.maps.LatLng(lat, lng));
        }

        console.log(positions);
        logElevation(positions,elevator, map);
        
    } else {
        alert("Please place two markers on the map before dividing the line.");
    }
}

function logElevation(path,elevator,map){

    elevator.getElevationAlongPath({
        'path': path,
        'samples': 50
    }, plotElevation);

}
function plotElevation(positions, status){
    if (status === 'OK') {
        for (var i=0; i < positions.length; i++){
            console.log(positions[i].elevation);
        }
    }
}


// ez valami hasonlot csinalna elv mint a heywhatsthat-be hogy pirossal mutatja, hogy mi látszik
/*var rectangle = new google.maps.Rectangle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: map,
    bounds: {
        north: 47.5079,
        south: 47.4879,
        east: 19.0502,
        west: 19.0302
    }
});
*/