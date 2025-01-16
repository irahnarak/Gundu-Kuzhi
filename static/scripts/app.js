window.onload = function () {
    clearData();
    getData();
};

function clearData() {
    document.getElementById("lat").value = "";
    document.getElementById("lng").value = "";
    document.getElementById("p_desc").value = "";
    document.getElementById("p_location").value = "";
    document.getElementById("p_taluk").value = "";
    document.getElementById("p_district").value = "";
}

function getData() {
    var markers = null;
    fetch("/home_data")
        .then((response) => {
            // Check if the request was successful (status code 200-299)
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            // Parse the response body as JSON
            return response.json();
        })
        .then((data) => {
            markers = data;
            markers.forEach(function (markerData) {
                var roundIcon = L.divIcon({
                    className: "round-marker", // Use the class defined in CSS for custom style
                    iconSize: [15, 15], // Set the size of the round marker
                });
                console.log(markerData);

                var bindpop_text = `<small>Pothole desc : ${markerData.pothole_desc}</small><br><small>Location: ${markerData.location}</small><br><small>Taluk - District: ${markerData.taluk} - ${markerData.district}</small>`;

                L.marker([markerData.latitude, markerData.longitude], {
                    icon: roundIcon,
                })
                    //.bindPopup(markerData.title)
                    .bindPopup(bindpop_text)
                    .addTo(map);
            });
        })
        .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
        });

    // Step 4: Iterate through the markers array and add markers to the map
}

//map//

var map = L.map("map").setView([12.9749, 80.1328], 12);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var marker = null;
function initialise_marker() {
    marker = null;
}

map.on("click", function (e) {
    var lat = e.latlng.lat; // Latitude
    var lng = e.latlng.lng; // Longitude
    getDistrictTaluk(lng, lat);
    document.getElementById("add_btn").innerText = "wait..";
    document.getElementById("add_btn").disabled = true;

    if (marker) {
        marker.setLatLng(e.latlng);
    } else {
        marker = L.marker(e.latlng).addTo(map);
    }

    // Display the selected coordinates
    document.getElementById("lat").value = `${lat.toFixed(5)}`;
    document.getElementById("lng").value = `${lng.toFixed(5)}`;
});
//map-end//

//get talukdistrict data//

function getDistrictTaluk(lng, lat) {
    const coordinate = [lng, lat]; // Longitude, Latitude

    fetch("/validate_boundry", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ coordinate: coordinate }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Response from server:", data);
            if (data.district && data.taluk) {
                console.log(`District: ${data.district}, Taluk: ${data.taluk}`);
                document.getElementById("p_taluk").value = data.taluk;
                document.getElementById("p_district").value = data.district;
                document.getElementById("add_btn").disabled = false;
                document.getElementById("add_btn").innerText = "Report Pothole";
            } else {
                console.log("Point not inside any boundary.");
            }
        })
        .catch((error) => {
            console.error("Error loading GeoJSON or fetching data:", error);
        });
}

//get talukdistrict data end//

//add_event start//
function add_event() {
    lat = document.getElementById("lat").value;
    lng = document.getElementById("lng").value;
    let p_taluk = document.getElementById("p_taluk").value;
    let p_district = document.getElementById("p_district").value;

    if (lat != "" && lng != "" && p_taluk != "" && p_district != "") {
        let modal = document.getElementById("add-pothole-model");

        modal.style.display = "block";
        let closeModalBtn = document.getElementById("closeModalBtn");

        let modalForm = document.getElementById("modalForm");

        closeModalBtn.onclick = function () {
            modal.style.display = "none";
        };

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    } else {
        alert("Please mark the pothole location (TN)");
    }
}
//add_event end//

//pothole form validation//
modalForm.onsubmit = function (event) {
    // Prevent the form from submitting normally
    event.preventDefault();
    var taluk = document.getElementById("p_taluk");
    var district = document.getElementById("p_district");

    if (taluk.disabled) {
        taluk.disabled = false; // Temporarily enable
    }

    if (district.disabled) {
        district.disabled = false; // Temporarily enable
    }

    // Check if the form is valid
    if (!modalForm.checkValidity()) {
        console.log("Form is invalid");
        alert("Please fill in all required fields.");
    } else {
        console.log("Form is valid");
        handleSubmit();
        taluk.disabled = true;
        district.disabled = true;
    }
};
//pothole form validation end//

//post form//
async function handleSubmit() {
    var formData = new FormData();

    // Get the values of the inputs
    var p_location = document.getElementById("p_location").value;
    var p_desc = document.getElementById("p_desc").value;
    var p_taluk = document.getElementById("p_taluk").value;
    var p_district = document.getElementById("p_district").value;
    var lat = document.getElementById("lat").value;
    var lng = document.getElementById("lng").value;

    formData.append("location", p_location);
    formData.append("pothole_desc", p_desc);
    formData.append("p_taluk", p_taluk);
    formData.append("p_district", p_district);
    formData.append("latitude", lat);
    formData.append("longitude", lng);

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
}
//post form end//

//user coord//
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
//end user coord//
