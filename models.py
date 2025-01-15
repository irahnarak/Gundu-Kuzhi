# models.py

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Pothole(db.Model):
    __tablename__ = "pothole"

    id = db.Column(db.String(37), primary_key=True)
    pothole_desc = db.Column(
        db.String(60), nullable=False
    )  # Corresponds to varchar(60)
    location = db.Column(db.String(100), nullable=False)
    taluk = db.Column(db.String(30), nullable=False)
    district = db.Column(db.String(30), nullable=False)

    latitude = db.Column(
        db.Numeric(9, 5), nullable=False
    )  # Corresponds to decimal(9,5)
    longitude = db.Column(
        db.Numeric(9, 5), nullable=False
    )  # Corresponds to decimal(9,5)

    def to_dict(self):
        return {
            "id": self.id,
            "pothole_desc": self.location,
            "location": self.location,
            "taluk": self.taluk,
            "district": self.district,
            "latitude": self.latitude,
            "longitude": self.longitude,
        }
