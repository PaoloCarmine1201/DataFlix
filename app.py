from flask import Flask, render_template
from pymongo import MongoClient

app = Flask(__name__)

# Stringa di connessione a MongoDB Atlas
uri = "mongodb+srv://paolocarminevalletta:80Gn6EG85vp8A363@dataset.j95khcl.mongodb.net/?retryWrites=true&w=majority&appName=Dataset"
client = MongoClient(uri)

# Sostituisci 'nome_database' e 'nome_collezione' con i nomi del tuo database e collezione
db = client['dataflix']
collection = db['dataflix']

@app.route('/')
def index():
    # Recupero di tutte le entry dal database
    entries = list(collection.find())
    return render_template('index.html', entries=entries)

if __name__ == '__main__':
    app.run(debug=True)
