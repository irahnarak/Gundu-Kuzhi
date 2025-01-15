from flask_mysqldb import MySQL


MYSQL_CONFIG = {
    "MYSQL_HOST": "localhost",  # MySQL server address
    "MYSQL_USER": "hari",  # MySQL username
    "MYSQL_PASSWORD": "charidb29",  # MySQL password
    "MYSQL_DB": "holestic",  # Your database name
}


def init_db(app):
    """Initialize the MySQL connection."""
    app.config.update(MYSQL_CONFIG)

    mysql = MySQL(app)
    return mysql


def check_connection(mysql):
    """Check the MySQL connection."""
    try:
        # Try to establish a connection and execute a simple query
        cur = mysql.connection.cursor()
        cur.execute("SELECT 1")  # Just testing the connection
        cur.close()
        return True, "MySQL connection is successful!"
    except Exception as e:
        return False, f"Failed to connect to MySQL: {e}"


def p_save(mysql):
    