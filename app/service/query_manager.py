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

def get_first_80_entries():
    query = collection.find().limit(80)
    result = list(query)
    convert_objectid_to_str(result)
    return result

# Utilizzo un'espressione regolare con l'opzione 'i' per la ricerca case-insensitive
def find_by_title(title):
    query = {"title": {"$regex": title, "$options": "i"}}
    result = collection.find(query)
    result = list(result)
    convert_objectid_to_str(result)
    return result

def find_by_title(title):
    query = {"title": {"$regex": title, "$options": "i"}}
    result = collection.find(query)
    result = list(result)
    convert_objectid_to_str(result)
    return result

def find_by_person(fullname):
    query = {
        "$or": [
            {"director": {"$regex": fullname, "$options": "i"}},
            {"cast": {"$regex": fullname, "$options": "i"}}
        ]
    }
    result = collection.find(query)
    result = list(result)
    convert_objectid_to_str(result)
    return result

def find_by_year(year):
    query = {"release_year": year}
    result = collection.find(query)
    result = list(result)
    convert_objectid_to_str(result)

    return result

def group_by_country():
    pipeline = [
        {
            "$group": {
                "_id": "$country",       # Raggruppa per paese
                "count": {"$sum": 1}     # Conta il numero di documenti per ciascun paese
            }
        },
        {
            "$project": {
                "country_name": "$_id",  # Rinomina il campo _id a country_name
                "count": 1,              # Mantieni il campo count
                "_id": 0                 # Escludi il campo _id originale dalla risposta
            }
        },
        {
            "$sort": {"count": -1}  # Ordina i risultati per conteggio in ordine decrescente
        }
    ]

    # Esegui l'aggregazione
    results = list(collection.aggregate(pipeline))
    return results

def get_release_years():
    unique_years = collection.distinct('release_year')
    return unique_years
    