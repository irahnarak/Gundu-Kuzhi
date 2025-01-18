# routes.py

from flask import request, jsonify, render_template, redirect, url_for, flash
from models import db, Pothole
import uuid
import geopandas as gpd
from shapely.geometry import Point
import os
import json


def translate(page_type):
    if page_type == "home":
        tr_json_file_path = "static/translate/translations.json"
    elif page_type == "help":
        tr_json_file_path = "static/translate/translations_help.json"

    abs_tr_json_file_path = os.path.join(os.path.dirname(__file__), tr_json_file_path)

    with open(abs_tr_json_file_path, "r") as file:
        translations = json.load(file)
    return translations


def home():
    # Get the language from query parameters, default to 'en'
    lang = request.args.get("lang", "en")
    if lang:
        # Assuming `translate()` is a function that provides translations.
        translations_for_language = translate("home").get(lang, {})
    else:
        translations_for_language = translate("home").get("en", {})

    return render_template(
        "home.html", translations=translations_for_language, lang=lang
    )


def set_language():
    # Get the language from the query parameter
    language = request.args.get("lang", "en")

    # Redirect to the main page with the new language query parameter
    return redirect(url_for("home", lang=language))


def help_set_language():
    # Get the language from the query parameter
    language = request.args.get("lang", "en")

    # Redirect to the main page with the new language query parameter
    return redirect(url_for("help", lang=language))


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
    abs_geojson_file_path = os.path.join(os.path.dirname(__file__), geojson_file_path)

    gdf = gpd.read_file(abs_geojson_file_path)

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
    return jsonify(None)


def help():
    lang = request.args.get("lang", "en")
    if lang:
        # Assuming `translate()` is a function that provides translations.
        translations_for_language = translate("help").get(lang, {})
    else:
        translations_for_language = translate("help").get("en", {})

    return render_template(
        "help.html", translations_help=translations_for_language, lang=lang
    )


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
