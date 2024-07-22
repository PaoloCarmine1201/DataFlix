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

#Query che restituisce i titoli aggiunti su Netflix negli ultimi 6 mesi
def get_new_added():
    seven_day_ago = datetime.now() - timedelta(days=7)

    pipeline = [
        {
            "$match": {
                "date_added": {"$gte": seven_day_ago.strftime('%B %d, %Y')}
            }
        },
        {
            "$sort": {"date_added": -1}
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