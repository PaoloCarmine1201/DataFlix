from flask import Flask
from .db_connection import connection

def create_app():
    app = Flask(__name__)
    
    # Passa la connessione al contesto dell'applicazione
    app.db = connection()
    
    from .controller.query_controller import user_bp
    app.register_blueprint(user_bp)
    
    return app
