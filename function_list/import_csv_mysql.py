import pandas as pd
import numpy as np
import os
from sqlalchemy import create_engine, VARCHAR, Float

def modify_data_types(df):
    data_types = {}  # Create an empty dictionary to store data types

    # Determine the data type for each column
    for column_name in df.columns:
        if pd.api.types.is_numeric_dtype(df[column_name]):
            # If the column is numeric, set its data type to Float
            data_types[column_name] = Float()
        else:
            # If the column is not numeric, set its data type based on the maximum length
            max_length = df[column_name].astype(str).str.len().max()
            data_types[column_name] = VARCHAR(max_length)
    return data_types

def csv2mysql(df, table_name, engine):
    # Modify data types based on the maximum length
    data_types = modify_data_types(df)
    df = df.replace([np.inf, -np.inf], np.nan)
    # Insert the DataFrame into the MySQL table with the specified data types
    print('Uploading table:', table_name)
    df.to_sql(table_name, con=engine, if_exists='replace', index=False, dtype=data_types)

def process_folder(folder_path, engine):
    for file_name in os.listdir(folder_path):
        if file_name.endswith('.tsv'):
            # Read the TSV file
            file_path = os.path.join(folder_path, file_name)
            df = pd.read_csv(file_path, sep='\t', header=0)
            table_name = os.path.splitext(file_name)[0]
            # Upload to MySQL
            csv2mysql(df, table_name, engine)

# MySQL connection
engine = create_engine('mysql+pymysql://jienan:624001479@140.116.214.133:3306/proteome')

# Folder containing the TSV files
folder_path = '/home/jiegou/harvard/web_netmhciipan_output'

# Process the folder
process_folder(folder_path, engine)
