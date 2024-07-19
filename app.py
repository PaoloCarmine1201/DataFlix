from flask import Flask, render_template
import service.db_connection as db
import service.query_manager as manager
from pymongo import MongoClient

app = Flask(__name__)

if __name__ == '__main__':
    app.run(debug=True)
