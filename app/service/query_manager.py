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

def find_entries(params):
    # Inizializza la query vuota e i parametri opzionali
    query = {}
    limit = None

    # Gestisci i parametri opzionali
    if 'year' in params:
        query["release_year"] = int(params['year'])

    if 'type' in params:
        query["type"] = params['type']
    
    if 'limit' in params:
        limit = int(params['limit'])

    if 'fullname' in params:
        fullname_query = {
            "$or": [
                {"director": {"$regex": params['fullname'], "$options": "i"}},
                {"cast": {"$regex": params['fullname'], "$options": "i"}}
            ]
        }
        # Unisci fullname_query con la query esistente usando $and
        if query:
            query = {"$and": [query, fullname_query]}
        else:
            query = fullname_query

    if 'title' in params:
        title_query = {"title": {"$regex": params['title'], "$options": "i"}}
        # Unisci title_query con la query esistente usando $and
        if query:
            query = {"$and": [query, title_query]}
        else:
            query = title_query
    
    # Costruisci la query
    if limit:
        cursor = collection.find(query).limit(limit)
    else:
        cursor = collection.find(query)
    
    # Converti il cursore in lista e modifica ObjectId
    result = list(cursor)
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
    