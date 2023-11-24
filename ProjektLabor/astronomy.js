//<![CDATA[
    const responseText = document.getElementById('response');
    var object;

    function DataFetching(){
        if(document.getElementById("astronomy").value != "Star"){
        const applicationID = '3cb5b2ff-1fca-43bc-bc7a-a4a7fc9a356d'; //AstronomyAPI ID (felhasználókód)
        const applicationSecret = '1c354b208955906551e14cf592033cd2d3abc5c51c9462caadce0a221306fbfca88e208ba027b2dd87d4e2a1b9751f4b4c99b2cfea73f10f545c3cdd62201dac9317d463a39e7d13f0adea16df927981393f71495ee5acdde6747de007f8aa89ccdeb8d50d02be4f45be045fde26e700';
                                    //applicationSecret = AstronomyAPI jelszo, weboldal: AstronomyAPI
        const authString = btoa(`${applicationID}:${applicationSecret}`);

        var nameValue = document.getElementById("astronomy").value;
        const t = new Date();
        var timeC = t.toLocaleTimeString();
        timeC = timeC.replaceAll(":","%3A");
        let d = new Date();
        let dateC = d.toISOString().split('T')[0];
        let latitudeC = document.getElementById("latitude").value;
        let longitudeC = document.getElementById("longitude").value;
        let elevationC = document.getElementById("elevation").value;

        $.ajax({
            method: 'GET',
            url: 'https://api.astronomyapi.com/api/v2/bodies/positions/'+nameValue+'?longitude='+longitudeC+'&latitude='+latitudeC+'&elevation='+elevationC+'&from_date='+dateC+'&to_date='+dateC+'&time='+timeC,
            headers: { 'Authorization': `Basic ${authString}`},
            contentType: 'application/json',
            success: function(result) {
                object = result;
                display();
                lathatoe();
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
        /*fetch('https://api.astronomyapi.com/api/v2/bodies/positions/'+nameValue+'?longitude='+longitudeC+'&latitude='+latitudeC+'&elevation='+elevationC+'&from_date='+dateC+'&to_date='+dateC+'&time='+timeC, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${authString}`
            },
        })
        .then(response => response.json())
        .then(data => {
            responseText.textContent = JSON.stringify(data, null, 2);
            object = JSON.parse(document.getElementById('response').textContent);
            display();
            lathatoe();
        })
        .catch(error => {
            responseText.textContent = 'Hiba: ' + error.message;
        });*/
        }else{
            var name = document.getElementById('Csillagok').value;
            $.ajax({
                method: 'GET',
                url: 'https://api.api-ninjas.com/v1/stars?name=' + name,
                headers: { 'X-Api-Key': 'vHLde9Uzlap8vNokJq92rw==SZZqdSFE50w3UUI1'},// API ninjas kulcs
                contentType: 'application/json',
                success: function(result) {
                    object = result;
                    display();
                },
                error: function ajaxError(jqXHR) {
                    console.error('Error: ', jqXHR.responseText);
                }
            });
        }
    }


    function display() {
        clear();
        if(document.getElementById("astronomy").value != "Star"){
            var drawAzimuth = object.data.table.rows[0].cells[0].position.horizontal.azimuth.degrees;
            drawAzimuth-=90;
            document.getElementById('response').innerHTML = "";
            var c = document.getElementById('Astronomy1');
            var ctx = c.getContext("2d");
            x1 = 200;
            y1 = 200;
            r =  150;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 + r * Math.cos(Math.PI *drawAzimuth / 180.0), y1 + r * Math.sin(Math.PI * drawAzimuth / 180.0));
            ctx.stroke();
            ctx.font = "30px Arial";
            ctx.fillText("N", 190, 35);
            ctx.fillText("S", 190, 390);
            ctx.fillText("W", 10, 205);
            ctx.fillText("E", 360, 205);

            var drawAltitude = object.data.table.rows[0].cells[0].position.horizontal.altitude.degrees;
            var c = document.getElementById('Astronomy2');
            var ctx = c.getContext("2d");
            x1 = 20;
            y1 = 360;
            r = 350;
            x2 = x1 + r * Math.cos(Math.PI * -drawAltitude / 180.0);
            y2 = y1 + r * Math.sin(Math.PI * -drawAltitude / 180.0);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(390, 360);
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.moveTo(x2, y2);
            
            ctx.arc(x2, y2, 10, 0, 2 * Math.PI);
            ctx.fillStyle = "#FF0000";
            ctx.moveTo(x1,y1);
            ctx.arc(x1, y1, 10, 0, 2 * Math.PI);
            ctx.fill();

            ctx.font = "20px Arial";
            ctx.fillText("Néző", 20, 390);
            ctx.font = "20px Arial";
            ctx.fillText("Égitest", x2 - 20, y2 - 20);
            ctx.stroke();
        }else{
            let Declination1 = object[0].declination.split(/(\s)/);
            let /*longitude*/ RightAscension1= object[0].right_ascension.split(" ");
            var Declination2 = [];
            var RightAscension2 = [];
            for (let i = 0; i < RightAscension1.length; i++) {
            RightAscension2[i] = Number(RightAscension1[i].slice(0,RightAscension1[i].length -1));
            }       
            var longitudeStar = RightAscension2[0] + RightAscension2[1]/60 + RightAscension2[2]/3600;
            if (longitudeStar > 180) {
                longitudeStar -= 360;
            }
            for (let i = 0; i < 3; i++) {
                Declination2[i] = Number(Declination1[(i*2)].slice(0,Declination1[(i*2)].length -1));
                }
            var latitudeStar = Declination2[0] + Declination2[1]/60 + Declination2[2]/3600;
            var longitudePerson= document.getElementById("longitude").value;
            var latitudePerson= document.getElementById("latitude").value;
            var latitudeDifference = latitudeStar - latitudePerson;
            var longitudeDifference = longitudeStar - longitudePerson;
            latitudeDifference = latitudeDifference * Math.PI/180;
            longitudeDifference = longitudeDifference * Math.PI/180;
            var semidistance = Math.pow(Math.sin(latitudeDifference/2),2)+Math.cos(latitudePerson)*Math.cos(latitudeStar)*Math.pow(Math.sin(longitudeDifference/2),2);
            var Distance = 2*6371*Math.pow(Math.atan2(Math.sqrt(semidistance),Math.sqrt(1-semidistance)),2);
            var StarAzimuth = Math.atan2(Math.sin(longitudeDifference)*Math.cos(latitudeStar),Math.cos(latitudePerson)*Math.sin(latitudeStar)-Math.sin(latitudePerson)*Math.cos(latitudeStar)*Math.cos(longitudeDifference));
            StarAzimuth = StarAzimuth * 180/Math.PI;

            var AverageRadius = 6372.797;
            var ViewerHeight = AverageRadius + document.getElementById("elevation").value;
            var tempDegree = Math.acos((Math.pow(AverageRadius,2)+Math.pow(Distance,2)-Math.pow(ViewerHeight,2))/(2*AverageRadius*Distance))*180/Math.PI;
            var TriangleDegree = (180 - tempDegree)*Math.PI/180;
            if (object[0].distance_light_year != "") {
                var DistanceStar = object[0].distance_light_year * 9460730472580.8;
            }else{
                var DistanceStar = 9460730472580.8;
            }
            var DistanceBetweenViewerAndStar = Math.sqrt(Math.pow(DistanceStar,2)+Math.pow(Distance,2)-2*DistanceStar*Distance*Math.cos(TriangleDegree));
            
            var altitude = Math.acos((Math.pow(Distance,2)+Math.pow(DistanceBetweenViewerAndStar,2)-Math.pow(DistanceStar,2))/(2*Distance*DistanceBetweenViewerAndStar))*180/Math.PI;
            
            var drawAzimuth = StarAzimuth;
            drawAzimuth-=90;
            var c = document.getElementById('Astronomy1');
            var ctx = c.getContext("2d");
            x1 = 200;
            y1 = 200;
            r =  150;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 + r * Math.cos(Math.PI *drawAzimuth / 180.0), y1 + r * Math.sin(Math.PI * drawAzimuth / 180.0));
            ctx.stroke();
            ctx.font = "30px Arial";
            ctx.fillText("N", 190, 35);
            ctx.fillText("S", 190, 390);
            ctx.fillText("W", 10, 205);
            ctx.fillText("E", 360, 205);

            var drawAltitude = altitude;
            var c = document.getElementById('Astronomy2');
            var ctx = c.getContext("2d");
            x1 = 20;
            y1 = 360;
            r = 350;
            x2 = x1 + r * Math.cos(Math.PI * -drawAltitude / 180.0);
            y2 = y1 + r * Math.sin(Math.PI * -drawAltitude / 180.0);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(390, 360);
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.moveTo(x2, y2);
            
            ctx.arc(x2, y2, 10, 0, 2 * Math.PI);
            ctx.fillStyle = "#FF0000";
            ctx.moveTo(x1,y1);
            ctx.arc(x1, y1, 10, 0, 2 * Math.PI);
            ctx.fill();

            ctx.font = "20px Arial";
            ctx.fillText("Néző", 20, 390);
            ctx.font = "20px Arial";
            ctx.fillText("Csillag", x2 - 20, y2 - 20);
            ctx.stroke();
            lathatoeCsillag(altitude);
        }
    }

    function clear() {
        var c1 = document.getElementById('Astronomy1').getContext("2d");
        c1.clearRect(0,0,400,400);
        var c2 = document.getElementById('Astronomy2').getContext("2d");
        c2.clearRect(0,0,400,400);
    }
    function lathatoe(){
        var Altitude = object.data.table.rows[0].cells[0].position.horizontal.altitude.degrees;
        if (Altitude > 0) {
            document.getElementById("lathatoe").innerHTML = "<h2>Látható<h2>";
        } else {
            document.getElementById("lathatoe").innerHTML = "<h2>Nem látható<h2>";
        }
    }

    function lathatoeCsillag(altitude) {
        if (altitude > 0) {
            document.getElementById("lathatoe").innerHTML = "<h2>Látható<h2>";
        } else {
            document.getElementById("lathatoe").innerHTML = "<h2>Nem látható<h2>";
        }
    }

    function addStars(){
        if (document.getElementById("astronomy").value =="Star") {
            var CsillagokString = '<label for="Csillagok">Kérlek válassz csillagot: </label><input type="text" id="Csillagok" name="Csillagok" value="Vega">';
            document.getElementById("csillagok").innerHTML = CsillagokString;
        }else{
            document.getElementById("csillagok").innerHTML = "";
        }
    }
    //]]>