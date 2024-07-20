from flask import Flask
from flask_cors import CORS
from app.controller.query_controller import user_bp  # Absolute import

app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

# Register the blueprint
app.register_blueprint(user_bp)

if __name__ == '__main__':
    app.run(debug=True)
