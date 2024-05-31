import requests
import pandas as pd

# Your Google Maps Geocoding API key
API_KEY = 'AIzaSyD4DQ8W_FnvX8ZZI9nIAZlgUtASyuEH8Gs'


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

"""
df = pd.read_excel('master')
column1 = 'city'
column2 = 'address'
# Check if specified columns exist
if column1 not in df.columns or column2 not in df.columns:
    raise ValueError(f"Specified columns '{column1}' or '{column2}' do not exist in the Excel file.")

# Create a list of tuples containing the values from the specified columns
cell_values = list(df[[column1, column2]].itertuples(index=False, name=None))

#return cell_values

"""
def process_excel_file(file_path):
    # Read the Excel file
    df = pd.read_excel(file_path)
    
    # Check if the required columns exist
    if 'city' not in df.columns or 'address' not in df.columns:
        raise ValueError("The Excel file must contain 'city' and 'address' columns.")
    
    # Add new columns for the coordinates
    df['cur_y'] = None
    df['cur_x'] = None
    
    # Iterate over the DataFrame rows
    for index, row in df.iterrows():
        full_address = f"{row['address']}, {row['city']}"
        print(full_address)
        lat, lng = get_coordinates(full_address)
        df.at[index, 'cur_y'] = lat
        df.at[index, 'cur_x'] = lng
    
    return df


# Example usage
#file_path = 'master.xlsx'  # Update this path if the file is located elsewhere


df_with_coordinates = process_excel_file("master.xlsx")

# Show the DataFrame
print(df_with_coordinates)

# Optionally, save the updated DataFrame back to a new Excel file
#df_with_coordinates.to_excel('path/to/your/output_excel_file.xlsx', index=False)



"""
# Sample data
data = {
    'city': ['New York', 'San Francisco','ירושלים'],
    'address': ['Central Park, NY', 'Golden Gate Bridge, CA','הכותל המערבי']
}

# Create a DataFrame
df = pd.DataFrame(data)

# Add new columns for the coordinates
df['cur_y'] = None
df['cur_x'] = None

# Iterate over the DataFrame rows
for index, row in df.iterrows():
    full_address = f"{row['address']}, {row['city']}"
    lat, lng = get_coordinates(full_address)
    df.at[index, 'cur_y'] = lat
    df.at[index, 'cur_x'] = lng

    # Show the DataFrame
print(df)

    """