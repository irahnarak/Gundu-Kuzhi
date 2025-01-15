class Config:
    """Base configuration class."""

    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Disable SQLAlchemy modification tracking
    SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://hari:charidb29@localhost/holestic"
