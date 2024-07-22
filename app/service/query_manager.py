from app.db_connection import connection
from bson import ObjectId
from datetime import datetime, timedelta

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
    
    if 'listed_in' in params:
        if isinstance(params['listed_in'], list):
            listed_in_query = {"listed_in": {"$in": params['listed_in']}}
        else:
            listed_in_query = {"listed_in": params['listed_in']}
        
        # Unisci listed_in_query con la query esistente usando $and
        if query:
            query = {"$and": [query, listed_in_query]}
        else:
            query = listed_in_query
    
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
            "$project": {
                "country": {
                    "$split": ["$country", ", "]  # Divide la stringa dei paesi in un array
                }
            }
        },
        {
            "$unwind": "$country"  # Decomprime l'array dei paesi in documenti separati
        },
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

#Query che restituisce i 10 film/Serie TV con il cast più numeroso
def get_top10_number_actors():
    pipeline = [
        {
            "$project": {
                "title": 1,
                "type": 1,
                "num_actors": {"$size": {"$split": ["$cast", ", "]}}
            }
        },
        {
            "$sort": {"num_actors": -1}
        },
        {
            "$limit": 10
        }
    ]

    results = list(collection.aggregate(pipeline))
    convert_objectid_to_str(results)

    return results

#Query che restituisce il numero medio di stagioni per le serieTV
def get_avg_seasons():
    pipeline = [
        {
            "$match": {"type": "TV Show"}
        },
        {
            "$group": {
                "_id": None,
                "average_seasons": {"$avg": {"$toInt": {"$arrayElemAt": [{"$split": ["$duration", " "]}, 0]}}}
            }
        },
         {
            "$project": {
                "_id": 0                 # Escludi il campo _id originale dalla risposta
            }
        }
    ]

    results = list(collection.aggregate(pipeline))
    convert_objectid_to_str(results)

    return results
    
#Query che restituisce i 10 film/Serie TV con il maggior numero di registi.
def get_top10_number_directors():
    pipeline = [
        {
            "$project": {
                "title": 1,
                "type": 1,
                "num_directors": {"$size": {"$split": ["$director", ", "]}}
            }
        },
        {
            "$sort": {"num_directors": -1}
        },
        {
            "$limit": 10
        }
    ]

    results = list(collection.aggregate(pipeline))
    convert_objectid_to_str(results)

    return results

#Query che raggruppa i titoli per anno di rilascio in oridne decrescente
def group_by_release_year():
    pipeline = [
        {
            "$group": {
                "_id": "$release_year",
                "count": {"$sum": 1}
            }
        },
        {
            "$project": {
                "release_year": "$_id",  # Rinomina il campo _id a country_name
                "count": 1,              # Mantieni il campo count
                "_id": 0                 # Escludi il campo _id originale dalla risposta
            }
        },
        {
            "$sort": {"count": -1}
        }
    ]

    results = list(collection.aggregate(pipeline))
    convert_objectid_to_str(results)

    return results

#Query che raggruppa i titoli in base al loro tipo (Movie, TV Show)
def group_by_type():
    pipeline = [
        {
            "$group": {
                "_id": "$type",  # Raggruppa per il campo 'type'
                "count": {"$sum": 1}  # Conta il numero di titoli per ogni tipo
            }
        },
        {
            "$sort": {"count": -1}  # Ordina per conteggio in ordine decrescente
        }
    ]

    results = list(collection.aggregate(pipeline))
    convert_objectid_to_str(results)

    return results