
window.onload = function () {
    document.getElementById("lat").value = "";
    document.getElementById("lng").value = ""
    document.getElementById("p_desc").value = ""
    document.getElementById("p_location").value = ""
    document.getElementById("p_taluk").value = ""
    document.getElementById("p_district").value = ""
};




function add_event() {
    lat = document.getElementById("lat").value;
    lng = document.getElementById("lng").value;

    if (lat != "" && lng != "") {
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

        // Handle form submission (optional)
        modalForm.onsubmit = function (event) {
            event.preventDefault(); // Prevent form from refreshing page

            // Capture input values (just as an example)
            let input1Value = document.getElementById("p_desc").value;
            let input2Value = document.getElementById("p_location").value;
            let input3Value = document.getElementById("p_taluk").value;
            let input4Value = document.getElementById("p_district").value;



            // For demonstration purposes, log the values to the console
            console.log("Input 1:", input1Value);
            console.log("Input 2:", input2Value);
            console.log("Input 3:", input3Value);
            console.log("Input 4:", input4Value);


            // Optionally close the modal after submission
            modal.style.display = "none";
        }

    }
    else {
        alert("Please mark the pothole location.")
    }



}


var map = L.map('map').setView([12.9749, 80.1328], 15);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Add a marker variable (initially null)
var markers = [
    { lat: 12.99708, lng: 80.10700, title: "Marker 1" },
    { lat: 12.97515, lng: 80.13329, title: "Marker 2" },
    { lat: 12.99253, lng: 80.10953, title: "Marker 3" }
];

// Step 4: Iterate through the markers array and add markers to the map
markers.forEach(function (markerData) {
    var roundIcon = L.divIcon({
        className: 'round-marker',  // Use the class defined in CSS for custom style
        iconSize: [15, 15],  // Set the size of the round marker

    });

    L.marker([markerData.lat, markerData.lng], { icon: roundIcon })
        //.bindPopup(markerData.title)
        .bindPopup('<a href="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg" target="_blank"><img src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg" alt="Map Tile" style="width: 200px; height: 200px; display: block;" /></a>')
        .addTo(map);
});
var marker = null;


map.on('click', function (e) {
    var lat = e.latlng.lat; // Latitude
    var lng = e.latlng.lng; // Longitude
    getDistrictTaluk(lng, lat)

    // Update or create a marker at the clicked location
    if (marker) {
        marker.setLatLng(e.latlng); // Move the marker to the new location
    } else {
        marker = L.marker(e.latlng).addTo(map); // Add a new marker
    }

    // Display the selected coordinates
    document.getElementById('lat').value = `${lat.toFixed(5)}`
    document.getElementById('lng').value = `${lng.toFixed(5)}`;
});
/*document.getElementById("submit_btn").addEventListener("click", async (event) => {
    event.preventDefault();
    var formData = new FormData();

    // Get the values of the inputs
    var loc_data = document.getElementById('loc_data').value;
    var pothole_desc = document.getElementById('pothole_desc').value;
    var image_upload = document.getElementById('image_upload').files[0];
    var lat = document.getElementById('lat').value;
    var lng = document.getElementById('lng').value;


    // Append the form data to FormData object
    formData.append('location', loc_data);
    formData.append('pothole_desc', pothole_desc);
    formData.append('image_upload', image_upload);
    formData.append('latitude', lat);
    formData.append('longitude', lng);




    try {
        const response = await fetch("/add_pothole", {
            method: "POST",

            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        document.getElementById('report_form').reset();

    } catch (error) {
        console.error("Error:", error);
    }
});*/


//remove
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    alert("hi")
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
                console.log(`The coordinate falls under: ${foundDistrict}`);
                console.log(`The coordinate falls under: ${foundTaluk}`);
                document.getElementById("p_taluk").value = foundTaluk;
                document.getElementById("p_district").value = foundDistrict;


            } else {
                console.log('No data found for the coordinate.');
            }
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
        });

}

//modal start
// Get the modal

// Get the button that opens the modal
//let openModalBtn = document.getElementById("add_btn");

// Get the <span> element that closes the modal


//modal end

