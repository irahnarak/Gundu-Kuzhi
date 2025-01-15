# from geopy.geocoders import Nominatim

# geolocator = Nominatim(user_agent="holestic-test")
# location = geolocator.reverse("12.97374 80.14011")
# print(location.raw["address"])

# {
#     "town": "Kundrathur",
#     "county": "Pallavaram",
#     "state_district": "Chengalpattu",
#     "state": "Tamil Nadu",
#     "ISO3166-2-lvl4": "IN-TN",
#     "postcode": "600069",
#     "country": "India",
#     "country_code": "in",
# }
# {
#     "village": "Manancheri",
#     "county": "Pallavaram",
#     "state_district": "Chengalpattu",
#     "state": "Tamil Nadu",
#     "ISO3166-2-lvl4": "IN-TN",
#     "postcode": "600069",
#     "country": "India",
#     "country_code": "in",
# }
# {
#     "suburb": "Anakaputhur",
#     "village": "Tharapakkam",
#     "county": "Pallavaram",
#     "state_district": "Chengalpattu",
#     "state": "Tamil Nadu",
#     "ISO3166-2-lvl4": "IN-TN",
#     "postcode": "600070",
#     "country": "India",
#     "country_code": "in",
# }
# https://www.tnpsc.gov.in/english/districts.html

"""
pincode:579b464db66ec23bdd000001101bee62355b41ea7b75887bfea59db0
/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd
All India Pincode Directory till last month 

lg:
/resource/1a6c26ed-d67c-40ea-aa20-d38d35f341a5

eg:https://api.data.gov.in/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd?api-key=579b464db66ec23bdd000001101bee62355b41ea7b75887bfea59db0&format=json&offset=1&limit=1
https://api.data.gov.in/resource/1a6c26ed-d67c-40ea-aa20-d38d35f341a5?api-key=579b464db66ec23bdd000001101bee62355b41ea7b75887bfea59db0&format=json&offset=1&limit=1&filters%5BstateNameEnglish.keyword%5D=Tamil%20Nadu
"""

import requests

# Set up the data to be sent in the POST request
data = {
    "case": "district",  # This corresponds to your "district" case
    "filter_code": "Ariyalur",  # You mentioned "Ariyalur" in the example
}

# Set up headers, including the app name
headers = {
    "X-APP-NAME": "Administrative Data - District",  # Replace with your actual app name
    "Content-Type": "application/json",  # Ensure the request body is JSON
}

# Send the POST request
response = requests.post(
    "https://tngis.tnega.org/generic_api/v1/getAdminDropDown",
    json=data,
    headers=headers,
)

# Print the response from the API
print(response.text)
