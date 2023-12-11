let map;
var pos1, pos2;
var polyline = null;
var marker1 = null;
var marker2 = null;
var markers = [];
var line;
var elevator;
var elevationData = [];
var elevationChart;


function calculateVisibility(heightAboveGround, distance){
    const earthRadius = 6371; // Föld sugara kilométerben

    // Magasság hozzáadása a Föld sugarához
    const observerHeight = heightAboveGround + earthRadius;

    // Látótávolság kiszámítása a Pythagoras-tétel alapján
    const visibility = Math.sqrt((2 * observerHeight * earthRadius) + (observerHeight ** 2));

    return visibility >= distance;
}
function checkVisibility(lat1, lon1, lat2, lon2){
    const maxDistanceForVisibility = 20;
    const distance = calculateDistance(lat1, lon1, lat2, lon2);
    return distance <= maxDistanceForVisibility;

}
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // földi sugár kilométerben
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // távolság kilométerben
    return distance;
  }

  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 47.4979, lng: 19.0402},
      zoom: 10
    });
    
    
    
    // Ellenőrizd, hogy az ElevationService létezik-e
    if (google.maps.ElevationService) {
        elevator = new google.maps.ElevationService();
    } else {
        console.error('Az ElevationService nem támogatott ezen a verziószámon.');
    }
    var resultDiv = document.getElementById('result');
  
    map.addListener('click', function(event) {
      if (markers.length === 2) {
        markers[0].setMap(null);
        markers.shift();
      }
  
      var marker = new google.maps.Marker({
        position: event.latLng,
        map: map
      });
  
      markers.push(marker);
  
      if (markers.length === 2) {
        var lat1 = markers[0].getPosition().lat();
        var lon1 = markers[0].getPosition().lng();
        var lat2 = markers[1].getPosition().lat();
        var lon2 = markers[1].getPosition().lng();
      
        var distance = calculateDistance(lat1, lon1, lat2, lon2);
        distance = distance.toFixed(2);
        resultDiv.innerHTML = 'Távolság a két pont között: ' + distance + ' km';
        
        var isVisible = checkVisibility(lat1, lon1, lat2, lon2);
        if (isVisible) {
            resultDiv.innerHTML += '<br>A pontok láthatók egymástól.';
        } else {
            resultDiv.innerHTML += '<br>A pontok nem láthatók egymástól.';
        }


        if(line){
            line.setMap(null);
        }

         line = new google.maps.Polyline({
            path: [{lat: lat1, lng: lon1}, {lat: lat2, lng: lon2}],
            geodesic: true,
            strokeColor: '#000000',  // Fekete szín
            strokeOpacity: 0.5,      // Átlátszóság (0-tól 1-ig terjedő érték)
            strokeWeight: 3          // Vonal vastagsága
          });
        
          line.setMap(map);
      }
    });
    
  }
  
  

  /*
  function logElevation(path, elevator, map) {
    const interval = 0.9; // Méterekben
    const distance = calculateDistance(path[0].lat, path[0].lng, path[1].lat, path[1].lng);
    const numSamples = Math.ceil(distance / interval);

    elevator.getElevationAlongPath({
        'path': path,
        'samples': numSamples
    }, function(positions, status) {
        if (status === 'OK') {
            plotElevation(positions, status);
            displayAltitudes(positions);
        } else {
            console.log('Hiba történt a magasságadatok lekérésekor.');
        }
    });
}
*/
//ez fog maradni, mert sajnos a google api nem tud több fájlt  befogadni...
//tovább kell majd ezt írni az else if részeket mert sok varriáció lehet
function logElevation(path, elevator, map) {
  // Számold ki a távolságot a két pont között
  const distance = calculateDistance(path[0].lat, path[0].lng, path[1].lat, path[1].lng);

  // Állítsd be a mintavételezési értéket az if-elágazásnak megfelelően
  let samples;
  if (distance < 10) {
      samples = 60;
  } else if (distance >= 10 && distance < 200) {
      samples = 150;
  } else if(distance >= 200 &&distance < 550){
      samples = 350
  } else if(distance >= 550 && distance < 1050){
    samples = 350
  }else {
      samples = 500;
  }

  elevator.getElevationAlongPath({
      'path': path,
      'samples': samples
  }, function(positions, status) {
      plotElevation(positions, status);
      displayAltitudes(positions);
  });
}
  
 /*
  function logElevation(path, elevator, map) {
    elevator.getElevationAlongPath({
        'path': path,
        'samples': 500
    }, function(positions, status) {
        plotElevation(positions, status);
        displayAltitudes(positions);
    });
}
*/
function plotElevation(positions, status) {
    if (status === 'OK') {

        elevationData = [];

        for (var i = 0; i < positions.length; i++) {
            elevationData.push(positions[i].elevation);
            //console.log(positions[i].elevation);
        }
        
        if(elevationData.length > 0){
            plotGraph();
        }else{
            console.log('Nincs elérhető magasság adat a grafikonhoz.');
        }
        

    }else{
            console.log('Hiba történt a magasságadatok lekérésekor.');
        }
}
function displayAltitudes(positions) {
    var altitudes = [];

    for (var i = 0; i < positions.length; i++) {
        altitudes.push(positions[i].elevation);
    }

    // Itt megteheted, amit szeretnél az altitudes tömbbel
    // Például, kiírhatod a konzolra, vagy megjelenítheted a felhasználónak
    console.log("Magasságok:", altitudes);
}



function requestElevation() {
    // Ellenőrizd, hogy van-e két marker
    if (markers.length === 2) {
        // Lekérdezze a két marker közötti magasságokat
        var lat1 = markers[0].getPosition().lat();
        var lon1 = markers[0].getPosition().lng();
        var lat2 = markers[1].getPosition().lat();
        var lon2 = markers[1].getPosition().lng();
        var path = [{ lat: lat1, lng: lon1 }, { lat: lat2, lng: lon2 }];

        // Hívja meg a logElevation függvényt
        logElevation(path, elevator, map);
    } else {
        console.log('Kérem helyezzen el két markert a térképen!');
    }
}


function plotGraph() {
    if (elevationChart) {
        elevationChart.destroy();
    }

    if (elevationData && elevationData.length > 0) {
        // Létrehoz egy div-et a grafikon konténerének
        var container = document.createElement('div');
        container.id = 'chartContainer';
        document.body.appendChild(container);

        // Rajzolja meg a grafikont a Chart.js segítségével
        var ctx = document.createElement('canvas').getContext('2d');
        container.appendChild(ctx.canvas);

        elevationChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: elevationData.map(function (_, index) { return index; }),
                datasets: [{
                    label: 'Magasság',
                    data: elevationData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 0
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        min: 0
                    }
                }
            }
        });

        // Állítsd be a konténer méretét a CSS segítségével
        container.style.width = '980px'; 
        container.style.height = '800px'; 
        container.style.position = 'absolute';
    } else {
        console.log('Nincs elérhető magasság adat a grafikonhoz.');
    }
    
}

/*
function calculateBearingAndDistance(lat1, lon1, lat2, lon2) {
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const y = Math.sin(dLon) * Math.cos(toRadians(lat2));
    const x = Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
              Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLon);

    const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    const distance = calculateDistance(lat1, lon1, lat2, lon2);

    return { bearing, distance };
}

// Függvény a két pont közötti láthatóság ellenőrzéséhez
function isPointBVisibleFromPointA(bearingA, bearingB) {
    const angularDifference = Math.abs(bearingA - bearingB);
    return angularDifference < 180;
}

document.addEventListener('DOMContentLoaded', function() {
    // Példa használat
    const pointA = { lat: 47.4979, lon: 19.0402 };
    const pointB = { lat: 47.518, lon: 19.040 };

    const { bearing: bearingA, distance: distanceA } = calculateBearingAndDistance(pointA.lat, pointA.lon, pointB.lat, pointB.lon);
    const { bearing: bearingB, distance: distanceB } = calculateBearingAndDistance(pointB.lat, pointB.lon, pointA.lat, pointA.lon);

    const isVisible = isPointBVisibleFromPointA(bearingA, bearingB);

    // Kiolvassuk a HTML elemet
    const resultContainer = document.getElementById('resultContainer');

    if (resultContainer) {
        // Létrehozunk egy új div elemet az eredményekkel
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = `
            <p>A-tól B-ig irány: ${bearingA} fok, távolság: ${distanceA.toFixed(2)} km</p>
            <p>B-től A-ig irány: ${bearingB} fok, távolság: ${distanceB.toFixed(2)} km</p>
            <p>B pont látható A pontból: ${isVisible ? 'Igen' : 'Nem'}</p>
        `;

        // Hozzáadjuk az új div elemet a container-hez
        resultContainer.appendChild(resultDiv);
    } else {
        console.error("A 'resultContainer' ID-jú elem nem található.");
    }
});
*/