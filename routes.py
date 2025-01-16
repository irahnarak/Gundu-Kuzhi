# routes.py

from flask import request, jsonify, render_template
from models import db, Pothole
import uuid
import geopandas as gpd
from shapely.geometry import Point
import os

# Route to test connection and view potholes


def home():
    # data = home_data()
    return render_template("home.html")


def home_data():
    potholes = db.session.query(Pothole).all()
    print(potholes)
    potholes_list = [pothole.to_dict() for pothole in potholes]

    # Return as JSON response (if using Flask)
    return jsonify(potholes_list)


# Function to validate if a point is within a boundary
def validate_boundry():
    # Read the GeoJSON file using GeoPandas
    data = request.get_json()
    coordinate = data["coordinate"]
    # coordinate = data.get("coordinate")
    geojson_file_path = "static/geoloc/Taluk.geojson"
    os.path.join(os.path.dirname(__file__), geojson_file_path)

    gdf = gpd.read_file(geojson_file_path)

    # Create a Shapely Point object for the given coordinate (longitude, latitude)
    point = Point(coordinate)

    # Iterate through the features to check which one contains the point
    for _, row in gdf.iterrows():
        if row["geometry"].contains(point):
            found_district = row["dist_name"]
            found_taluk = row["taluk_name"]
            print(found_district, found_taluk)
            # Convert the set to a list before returning it
            return jsonify({"taluk": found_taluk, "district": found_district})

    # Return None if point is not inside any polygon
    return None, None

    # # Example usage
    # geojson_file_path = (
    #     "/static/geoloc/Taluk.geojson"  # Path to the GeoJSON file on the server
    # )
    # coordinate = (78.9629, 20.5937)  # Example coordinate (longitude, latitude)

    # district, taluk = validate_point_in_boundary(coordinate, geojson_file_path)

    # if district and taluk:
    #     print(f"Found District: {district}, Taluk: {taluk}")
    # else:
    #     print("Point not found in any boundary.")


def test_connection():
    try:
        # Check if the database is connected
        db.session.query(Pothole).first()  # Query to ensure connection works
        return jsonify({"success": True, "message": "MySQL connection is successful!"})
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to connect: {e}"}), 500


def p_save():
    try:
        pothole_data = request.form.to_dict()

        print(pothole_data)

        new_pothole = Pothole(
            id="p" + str(uuid.uuid4()),
            pothole_desc=pothole_data["pothole_desc"],
            location=pothole_data["location"],
            taluk=pothole_data["p_taluk"],
            district=pothole_data["p_district"],
            latitude=pothole_data["latitude"],
            longitude=pothole_data["longitude"],
        )

        db.session.add(new_pothole)

        db.session.commit()

        return jsonify(
            {"success": True, "message": "Pothole record added successfully!"}
        )

    except Exception as e:
        return jsonify({"success": False, "message": f"Error: {e}"}), 400
