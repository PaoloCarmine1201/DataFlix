from flask import Flask, render_template
import service.db_connection as db
from pymongo import MongoClient

app = Flask(__name__)

@app.route('/')
def index():
    # Recupero di tutte le entry dal database
    entries = db.connection()
    return render_template('index.html', entries=entries)

if __name__ == '__main__':
    app.run(debug=True)
