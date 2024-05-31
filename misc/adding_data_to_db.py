import pandas as pd
import firebase_admin
import requests
from firebase_admin import credentials, firestore

# Google Maps Geocoding API key. todo: NEED TO HIDE THIS!!
API_KEY = 'AIzaSyD4DQ8W_FnvX8ZZI9nIAZlgUtASyuEH8Gs'


def reverse_hebrew_text(text):
    if isinstance(text, str):
        return text[::-1]
    return text


def get_coordinates(address):
    # Prepare the request URL
    url = f'https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={API_KEY}'

    # Send the request
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        if data['status'] == 'OK':
            # Extract the coordinates
            location = data['results'][0]['geometry']['location']
            return location['lat'], location['lng']
        else:
            print('Geocoding API error:', data['status'])
    else:
        print('Request failed with status code:', response.status_code)

    return None, None


def init_database():
    # Initialize Firestore connection
    cred = credentials.Certificate(
        'misc/itim-project-firebase-adminsdk-p6q9k-9ae897ad40.json')
    firebase_admin.initialize_app(cred)
    return firestore.client()


if __name__ == "__main__":
    db = init_database()

    # Read Excel file
    df = pd.read_excel('misc/MikvesTest.xlsx', header=0)

    # Convert all columns to string
    df = df.astype(str)

    column_names = df.iloc[0]
    df.columns = column_names

    # List to store IDs to check for duplicates
    seen_ids = []

    for index, row in df.iloc[1:].iterrows():
        mikve_ID = str(row["ID"])
        if row['address'] != 'nan':
            full_address = f"{row['address']}, {row['city']}"
            lat, lng = get_coordinates(full_address)
            df.at[index, 'cur_y'] = lat
            df.at[index, 'cur_x'] = lng
        # Add ID to seen list
        seen_ids.append(mikve_ID)
        # Create doc_ref only if the condition is met
        doc_ref = db.collection('Mikves').document(mikve_ID)
        doc_ref.set(row.to_dict())  # Add data to Firestore
