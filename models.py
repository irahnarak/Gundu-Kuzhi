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
    latitude = db.Column(
        db.Numeric(9, 5), nullable=False
    )  # Corresponds to decimal(9,5)
    longitude = db.Column(
        db.Numeric(9, 5), nullable=False
    )  # Corresponds to decimal(9,5)

    def __repr__(self):
        return f"<Pothole {self.id}>"
