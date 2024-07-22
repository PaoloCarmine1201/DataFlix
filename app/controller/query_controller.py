from flask import Blueprint, jsonify, request
import app.service.query_manager as manager

user_bp = Blueprint('user', __name__)

@user_bp.route("/find_by_title", methods=['POST'])
def find_by_title():
    data = request.get_json()
    title = data.get("title")
    
    if title:
        title = str.lower(title)
        result = manager.find_by_title(title)
        return jsonify(result)
    else:
        return jsonify({"error": "Title is required"}), 400

@user_bp.route("/find_by_person", methods=['POST'])
def find_by_person():
    data = request.get_json()
    fullname = data.get("fullname")
    
    if fullname:
        fullname = str.lower(fullname)
        result = manager.find_by_person(fullname)
        return jsonify(result)
    else:
        return jsonify({"error": "Fullname is required"}), 400

@user_bp.route("/search_entries", methods=['POST'])
def search_entries():
    # Recupera i parametri dalla richiesta JSON
    data = request.get_json()
    
    # Verifica che i parametri siano presenti e corretti
    year = data.get("year")
    type = data.get("type")
    limit = data.get("limit")
    
    # Costruisce il dizionario dei parametri per la funzione del manager
    params = {}
    
    if year:
        try:
            params["year"] = int(year)
        except ValueError:
            return jsonify({"error": "Invalid year format"}), 400
    
    if type:
        if type not in ["Movie", "TV Show"]:
            return jsonify({"error": "Invalid type. Valid types are 'Movie' and 'TV Show'."}), 400
        params["type"] = type

    if limit:
        try:
            params["limit"] = int(limit)
        except ValueError:
            return jsonify({"error": "Invalid limit format"}), 400
    
    # Chiama la funzione manager per ottenere i risultati
    result = manager.find_entries(params)
    return jsonify(result)

@user_bp.route("/group_by_country", methods=['POST'])
def group_by_country():
    result = manager.group_by_country()
    return jsonify(result)

@user_bp.route("/get_release_years", methods=['POST'])
def get_release_years():
    result = manager.get_release_years()
    return jsonify(result)