from flask import Flask, render_template
from pymongo import MongoClient

uri = "mongodb+srv://paolocarminevalletta:80Gn6EG85vp8A363@dataset.j95khcl.mongodb.net/?retryWrites=true&w=majority&appName=Dataset&tlsAllowInvalidCertificates=true"
client = MongoClient(uri)

db = client['dataflix']
collection = db['dataflix']

def connection():
    return collection