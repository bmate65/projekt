let start, end;

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 47.85395050048828, lng: 17.284271240234375 },
        zoom: 14,
    });
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const geocoder = new google.maps.Geocoder();

    document.getElementById("inputStart").addEventListener("keydown", (e) => {
        if (e.keyCode === 13) {
            geocodeAddress(geocoder, map, "inputStart");
        }
    });

    document.getElementById("inputEnd").addEventListener("keydown", (e) => {
        if (e.keyCode === 13) {
            geocodeAddress(geocoder, map, "inputEnd");
        }
    });

    function geocodeAddress(geocoder, resultsMap, id) {
        const address = document.getElementById(id).value;
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === "OK") {
                resultsMap.setCenter(results[0].geometry.location);
                const marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location,
                });
                if (id === "inputStart") {
                    start = results[0].geometry.location;
                } else {
                    end = results[0].geometry.location;
                }
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    }
}

function getDistance() {
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
            origins: [start],
            destinations: [end],
            travelMode: "DRIVING",
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false,
        },
        (response, status) => {
            if (status !== "OK" || response.rows[0].elements[0].status === "ZERO_RESULTS") {
                alert("Error was encountered: " + status);
            } else {
                const distance = response.rows[0].elements[0].distance.text;
                const duration = response.rows[0].elements[0].duration.text;
                const output = document.getElementById("output");
                output.innerHTML = `<p>Távolság: ${distance}</p><p>Időtartam: ${duration}</p>`;
            }
        }
    );
}