import pandas as pd


def filter_excel(input_file, output_file):
    # Load the Excel file into a DataFrame
    df = pd.read_excel(input_file)

    column_names = df.iloc[0]
    df.columns = column_names

    # Define the columns to check for NaN values
    columns_to_check = ['city', 'name', 'address',
                        'phone', 'accessibility', 'shelter']

    # Filter the DataFrame to remove rows with NaN values in the specified columns
    filtered_df = df.dropna(subset=columns_to_check)

    # Save the filtered DataFrame to a new Excel file
    filtered_df.to_excel(output_file, index=False)


# Example usage
input_file = 'misc/MikveData.xlsx'
output_file = 'misc/MikvesTest.xlsx'
filter_excel(input_file, output_file)
