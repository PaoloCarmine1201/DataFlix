from flask import Blueprint, jsonify, request
import app.service.query_manager as manager

user_bp = Blueprint('user', __name__)

@user_bp.route("/search_entries", methods=['POST'])
def search_entries():
    # Recupera i parametri dalla richiesta JSON
    data = request.get_json()
    
    # Verifica che i parametri siano presenti e corretti
    year = data.get("year")
    type = data.get("type")
    limit = data.get("limit")
    fullname = data.get("fullname")
    title = data.get("title")

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
    
    if fullname:
        params["fullname"] = fullname
    
    if title:
        params["title"] = title
    
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