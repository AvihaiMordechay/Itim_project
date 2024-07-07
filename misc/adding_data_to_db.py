import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
import requests

# Google Maps Geocoding API key.
with open("misc/google_api.txt", 'r') as file:
    API_KEY = file.read()


def reverse_hebrew_text(text):
    if isinstance(text, str):
        return text[::-1]
    return text


def get_coordinates(address):
    # Prepare the request URL
    url = f'https://maps.googleapis.com/maps/api/geocode/json?address={
        address}&key={API_KEY}'

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
        '/Users/avihaimor/Desktop/Itim_project/misc/itim-mikves-project-firebase-adminsdk-vxagm-50a369bc6a.json')
    firebase_admin.initialize_app(cred)
    return firestore.client()


def upload_data_to_firestore(df, db):
    for index, row in df.iterrows():
        # Parse IDs into a list
        ids = row['ID'].replace('\n', ' ').split()

        # Prepare the full address
        if row['address'] != 'nan':
            full_address = f"{row['address']}, {row['city']}"
        else:
            full_address = f"{row['city']}"

        # Get coordinates
        lat, lng = get_coordinates(full_address)

        # Determine the boolean value for 'levad'
        # Replace this with your actual logic to determine the boolean value
        levad = True if row['levad'] == 'true' else False

        # Prepare document data
        doc_data = {
            'ids': ids,
            'position': {'latitude': lat, 'longitude': lng} if lat is not None and lng is not None else None,
            'levad': levad  # Add the boolean field here
        }

        if ids[0][0] == "T":
            doc_data['ids'] = []

        # Add other fields as strings
        for col in df.columns:
            if col not in ['ID', 'position', 'levad']:
                doc_data[col] = row[col]

        # Set document in Firestore
        # Use the first ID as document name
        doc_ref = db.collection('Mikves').document(ids[0])
        doc_ref.set(doc_data)


if __name__ == "__main__":
    db = init_database()

    # Read Excel file
    df = pd.read_excel(
        '/Users/avihaimor/Desktop/Itim_project/misc/MikvesNewTest.xlsx', header=0)

    # Convert all columns to string
    df = df.astype(str)

    # Replace 'nan' with an empty string
    df = df.replace('nan', '')

    # Set column names
    column_names = df.iloc[0]
    df.columns = column_names
    df = df[1:]  # Remove the first row as it is used for headers

    # Upload data to Firestore
    upload_data_to_firestore(df, db)
