window.onload = function () {
    clearData();
    getData();
};


// lang = new URLSearchParams(window.location.search).get('lang').slice(-2);
document.getElementById('languageSelect').value = lang;
clicked = false;
cur_loc = false;

function reportEnabler(position) {
    if (position === "dis") {
        document.getElementById("add_btn").disabled = true;
    }
    else if ((position === "en")) {
        document.getElementById("add_btn").disabled = false;
    }



}
function currentLocationEnabler(position) {

    if (position === "dis") {
        document.getElementById("current_location").disabled = true;
    }
    else if ((position === "en")) {
        document.getElementById("current_location").disabled = false;
    }


}


function changeLanguage() {
    var language = document.getElementById("languageSelect").value;
    // Here you can either redirect or apply a translation
    window.location.href = "/set_language?lang=" + language;
}

function clearData() {
    document.getElementById("lat").value = "";
    document.getElementById("lng").value = "";
    document.getElementById("p_desc").value = "";
    document.getElementById("p_location").value = "";
    document.getElementById("p_taluk").value = "";
    document.getElementById("p_district").value = "";
    currentLocationEnabler("en");
    reportEnabler("dis")
}

function getData() {
    // var markers = null;
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

function initialiseMarker() {
    marker = null;
}
//map//

var map = L.map("map").setView([12.9749, 80.1328], 8);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

initialiseMarker();



let isClickEnabled = true;
map.on("click", handleMapClick);
function handleMapClick(e) {
    clicked = true;
    cur_loc = false;

    var lat = e.latlng.lat; // Latitude
    var lng = e.latlng.lng; // Longitude
    reportEnabler("dis");
    currentLocationEnabler("dis")
    document.getElementById("add_btn").innerText = translations["loading"];
    disableMapClicks();
    getDistrictTaluk(lng, lat);

    if (marker) {
        marker.setLatLng(e.latlng);
    } else {
        marker = L.marker(e.latlng).addTo(map);
    }


    // Display the selected coordinates
    document.getElementById("lat").value = `${lat.toFixed(5)}`;
    document.getElementById("lng").value = `${lng.toFixed(5)}`;

}
// Function to enable clicks
function enableMapClicks() {
    if (!isClickEnabled) {
        map.on("click", handleMapClick);
        isClickEnabled = true;
    }
}

// Function to disable clicks
function disableMapClicks() {
    if (isClickEnabled) {
        map.off("click", handleMapClick);
        isClickEnabled = false;
    }
}

// Attach the click event handler to the map


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
                document.getElementById("add_btn").innerHTML = `${translations["add_btn"]} 
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-octagon-fill" viewBox="0 0 16 16">
        <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
    </svg>`;
                document.getElementById("current_location").innerHTML = `${translations["current_location"]} 
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-crosshair2" viewBox="0 0 16 16">
    <path d="M8 0a.5.5 0 0 1 .5.5v.518A7 7 0 0 1 14.982 7.5h.518a.5.5 0 0 1 0 1h-.518A7 7 0 0 1 8.5 14.982v.518a.5.5 0 0 1-1 0v-.518A7 7 0 0 1 1.018 8.5H.5a.5.5 0 0 1 0-1h.518A7 7 0 0 1 7.5 1.018V.5A.5.5 0 0 1 8 0m-.5 2.02A6 6 0 0 0 2.02 7.5h1.005A5 5 0 0 1 7.5 3.025zm1 1.005A5 5 0 0 1 12.975 7.5h1.005A6 6 0 0 0 8.5 2.02zM12.975 8.5A5 5 0 0 1 8.5 12.975v1.005a6 6 0 0 0 5.48-5.48zM7.5 12.975A5 5 0 0 1 3.025 8.5H2.02a6 6 0 0 0 5.48 5.48zM10 8a2 2 0 1 0-4 0 2 2 0 0 0 4 0"/>
</svg>`;
                enableMapClicks();
                currentLocationEnabler("en");
                reportEnabler("en")


            }

            else {
                console.log("Point not inside any boundary.");
            }
        })
        .catch((error) => {
            if (error.message.includes("null")) {
                document.getElementById("add_btn").innerHTML = `${translations["add_btn"]} 
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-crosshair2" viewBox="0 0 16 16">
    <path d="M8 0a.5.5 0 0 1 .5.5v.518A7 7 0 0 1 14.982 7.5h.518a.5.5 0 0 1 0 1h-.518A7 7 0 0 1 8.5 14.982v.518a.5.5 0 0 1-1 0v-.518A7 7 0 0 1 1.018 8.5H.5a.5.5 0 0 1 0-1h.518A7 7 0 0 1 7.5 1.018V.5A.5.5 0 0 1 8 0m-.5 2.02A6 6 0 0 0 2.02 7.5h1.005A5 5 0 0 1 7.5 3.025zm1 1.005A5 5 0 0 1 12.975 7.5h1.005A6 6 0 0 0 8.5 2.02zM12.975 8.5A5 5 0 0 1 8.5 12.975v1.005a6 6 0 0 0 5.48-5.48zM7.5 12.975A5 5 0 0 1 3.025 8.5H2.02a6 6 0 0 0 5.48 5.48zM10 8a2 2 0 1 0-4 0 2 2 0 0 0 4 0"/>
</svg>`;
                alert(translations["boundry_alert"]);
                reportEnabler("en");

                clearData();
            }
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
            initialiseMarker();
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
    if (clicked == true) {
        map.removeLayer(marker);
        initialiseMarker();
    }

    clicked = false;
    cur_loc = true;

    curr_loc_btn = document.getElementById("current_location");
    if (navigator.geolocation) {

        curr_loc_btn.innerText = translations["loading"];
        disableMapClicks();
        currentLocationEnabler("dis");
        reportEnabler("dis");
        navigator.geolocation.getCurrentPosition(showPosition);



    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {


    lat = position.coords.latitude;
    lng = position.coords.longitude;
    document.getElementById("lat").value = `${lat.toFixed(
        5
    )}`;
    document.getElementById("lng").value = `${lng.toFixed(
        5
    )}`;

    if (marker) {
        marker.setLatLng([lat, lng]);
        map.setView([lat, lng], 14);
    } else {
        marker = L.marker([
            lat,
            lng,
        ]).addTo(map);
        map.setView([lat, lng], 14);
        getDistrictTaluk(lng, lat);
    }
}

//end user coord//
