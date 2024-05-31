import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firestore connection
cred = credentials.Certificate(
    "C:/Users/Elad/Desktop/itim_project/database testing/itim-project-firebase-adminsdk-p6q9k-2248f577a0.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

#------------------------------------------------------------

# Add data to Firestore function
# def add_data_to_firestore(address, phone):
#     doc_ref = db.collection('Mikeves').document('user1')
#     doc_ref.set({
#         'Address': address,
#         'Phone': phone
#     })


# add_data_to_firestore("Tel Aviv 123", "111-111-1111")


# Read Excel file
df = pd.read_excel('database testing/test.xlsx', header=0)


def reverse_hebrew_text(text):
    if isinstance(text, str):
        return text[::-1]
    return text



column_names = df.iloc[0]
df.columns = column_names


for index, row in df.iloc[1:].iterrows():
    mikve_ID = str(row["ID"])
    doc_ref = db.collection('elad_mikves_test').document(mikve_ID)  # Auto-generated ID
    doc_ref.set(row.to_dict())