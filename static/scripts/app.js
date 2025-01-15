
window.onload = function () {
    clearData();
    datas = getData();

};
function clearData() {
    document.getElementById("lat").value = "";
    document.getElementById("lng").value = ""
    document.getElementById("p_desc").value = ""
    document.getElementById("p_location").value = ""
    document.getElementById("p_taluk").value = ""
    document.getElementById("p_district").value = ""
}




function add_event() {
    lat = document.getElementById("lat").value;
    lng = document.getElementById("lng").value;
    let p_taluk = document.getElementById("p_taluk").value;
    let p_district = document.getElementById("p_district").value;

    if (lat != "" && lng != "" && p_taluk != "" && p_district != "") {
        let modal = document.getElementById("add-pothole-model");

        modal.style.display = "block";
        let closeModalBtn = document.getElementById("closeModalBtn");

        // Get the form and input fields
        let modalForm = document.getElementById("modalForm");

        // When the user clicks the button, open the 


        // When the user clicks on <span> (x), close the modal
        closeModalBtn.onclick = function () {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        modalForm.onsubmit = function (event) {
            event.preventDefault();

            // Capture input values (just as an example)
            let input1Value = document.getElementById("p_desc").value;
            let input2Value = document.getElementById("p_location").value;
            let input3Value = document.getElementById("p_taluk").value;
            let input4Value = document.getElementById("p_district").value;


            modal.style.display = "none";
        }

    }
    else {
        alert("Please mark the pothole location (TN)")
    }



}


var map = L.map('map').setView([12.9749, 80.1328], 12);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// Add a marker variable (initially null)

function getData() {
    var markers = null;
    fetch('/home_data')
        .then(response => {
            // Check if the request was successful (status code 200-299)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse the response body as JSON
            return response.json();
        })
        .then(data => {
            markers = data;
            markers.forEach(function (markerData) {
                var roundIcon = L.divIcon({
                    className: 'round-marker',  // Use the class defined in CSS for custom style
                    iconSize: [15, 15],  // Set the size of the round marker

                });

                var bindpop_text = `<small>Pothole desc : ${markerData.pothole_desc}</small><br><small>Location: ${markerData.location}</small><br><small>Taluk - District: ${markerData.taluk} - ${markerData.district}</small>`

                L.marker([markerData.latitude, markerData.longitude], { icon: roundIcon })
                    //.bindPopup(markerData.title)
                    .bindPopup(bindpop_text)
                    .addTo(map);
            });

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });



    // Step 4: Iterate through the markers array and add markers to the map


}

var marker = null;
function initialise_marker() {
    marker = null;

}

map.on('click', function (e) {
    var lat = e.latlng.lat; // Latitude
    var lng = e.latlng.lng; // Longitude
    getDistrictTaluk(lng, lat)


    if (marker) {
        marker.setLatLng(e.latlng);
    } else {
        marker = L.marker(e.latlng).addTo(map);
    }

    // Display the selected coordinates
    document.getElementById('lat').value = `${lat.toFixed(5)}`
    document.getElementById('lng').value = `${lng.toFixed(5)}`;
});
document.getElementById("submit_btn").addEventListener("click", async (event) => {
    event.preventDefault();
    var formData = new FormData();

    // Get the values of the inputs
    var p_location = document.getElementById('p_location').value;
    var p_desc = document.getElementById('p_desc').value;
    var p_taluk = document.getElementById('p_taluk').value;
    var p_district = document.getElementById('p_district').value;
    var lat = document.getElementById('lat').value;
    var lng = document.getElementById('lng').value;

    formData.append('location', p_location);
    formData.append('pothole_desc', p_desc);
    formData.append('p_taluk', p_taluk);
    formData.append('p_district', p_district);
    formData.append('latitude', lat);
    formData.append('longitude', lng);




    try {
        const response = await fetch("/add_pothole", {
            method: "POST",

            body: formData,
        });
        if (response.ok) {
            document.getElementById("closeModalBtn").click();
            clearData();
            marker.remove();
            getData();
            initialise_marker();


        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

    } catch (error) {
        console.error("Error:", error);
    }
});


//remove
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    alert(position.coords.latitude + "," + position.coords.longitude);
}
getLocation()



//
//ogr2ogr -f "GeoJSON" Districts.geojson Districts.shp
function getDistrictTaluk(lng, lat) {
    const coordinate = [lng, lat];  // Longitude, Latitude

    fetch('/static/geoloc/Taluk.geojson')
        .then(response => response.json())
        .then(geojson => {
            // Create a Turf.js Point object for the coordinate
            const point = turf.point(coordinate);

            let foundDistrict = null;

            // Iterate through GeoJSON features to check which one contains the point
            geojson.features.forEach(feature => {
                if (turf.booleanPointInPolygon(point, feature.geometry)) {
                    foundDistrict = feature.properties.dist_name;
                    foundTaluk = feature.properties.taluk_name;
                }
            });

            if (foundDistrict) {
                document.getElementById("p_taluk").value = foundTaluk;
                document.getElementById("p_district").value = foundDistrict;


            } else {
                console.log('No data found for the coordinate.');
                document.getElementById("p_taluk").value = "";
                document.getElementById("p_district").value = "";
            }
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
        });

}

