# app.py

from flask import Flask
from config import Config
from models import db
import routes

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize the database with the app
db.init_app(app)


@app.before_request
def create_tables():
    db.create_all()


# Register the routes
app.add_url_rule("/home", "home", routes.home)
app.add_url_rule("/home_data", "home_data", routes.home_data)
app.add_url_rule(
    "/validate_boundry", "validate_boundry", routes.validate_boundry, methods=["POST"]
)
app.add_url_rule("/test_connection", "test_connection", routes.test_connection)
app.add_url_rule("/add_pothole", "p_save", routes.p_save, methods=["POST"])

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")

# todo
# image upload

# lets make it simpler
