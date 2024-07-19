from pymongo import MongoClient
import service.db_connection as db
import pymongo

collection = db.connection()

# query ricerca canzone per nome
def find_all_movie():
    query = collection.find({"type": "Movie"})
    print(query)
    return list(query)

def find_all_series():
    query = collection.find({"type": "TV Show"})
    return list(query)