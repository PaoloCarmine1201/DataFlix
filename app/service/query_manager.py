from app.db_connection import connection
from bson import ObjectId

# Ottieni la collezione dal database
collection = connection()

def convert_objectid_to_str(document):
    """
    Converti gli ObjectId in stringhe all'interno del documento.
    """
    if isinstance(document, dict):
        for key, value in document.items():
            if isinstance(value, ObjectId):
                document[key] = str(value)
            elif isinstance(value, dict):
                convert_objectid_to_str(value)
            elif isinstance(value, list):
                for item in value:
                    if isinstance(item, dict):
                        convert_objectid_to_str(item)
    elif isinstance(document, list):
        for item in document:
            if isinstance(item, dict):
                convert_objectid_to_str(item)

def find_all_movie():
    query = collection.find({"type": "Movie"})
    result = list(query)
    convert_objectid_to_str(result)  # Converti ObjectId in stringa
    return result

def find_all_series():
    query = collection.find({"type": "TV Show"})
    result = list(query)
    convert_objectid_to_str(result)  # Converti ObjectId in stringa
    return result
