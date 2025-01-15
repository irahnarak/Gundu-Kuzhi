# routes.py

from flask import request, jsonify, render_template
from models import db, Pothole
import uuid


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


def new_pothole_form():
    return render_template("new_pothole_form.html")


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
