from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

image = Image.open("IMG_0171.JPG")
print(image)
exif_data = image._getexif()
print(exif_data)
gps_info = None
for tag, value in exif_data.items():
    if TAGS.get(tag) == "GPSInfo":
        gps_info = value
        break

if gps_info:
    # Convert GPS coordinates to latitude/longitude (this part depends on the EXIF format)
    lat = gps_info[2][0] + gps_info[2][1] / 60.0 + gps_info[2][2] / 3600.0
    lon = gps_info[4][0] + gps_info[4][1] / 60.0 + gps_info[4][2] / 3600.0
    print(f"Latitude: {lat}, Longitude: {lon}")
else:
    print("No GPS data found.")
