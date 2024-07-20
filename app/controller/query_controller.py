from flask import Blueprint, jsonify, request
import app.service.query_manager as manager

user_bp = Blueprint('user', __name__)

@user_bp.route("/movie/findAllMovie", methods=['POST'])
def find_all_movie():
    result = manager.find_all_movie()
    return jsonify(result)

@user_bp.route("/series/findAllSeries", methods=['POST'])
def find_all_series():
    result = manager.find_all_series()
    return jsonify(result)

@user_bp.route("/get_first_80_entries", methods=['POST'])
def get_first_80_entries():
    result = manager.get_first_80_entries()
    return jsonify(result)

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
    
@user_bp.route("/find_by_year", methods=['POST'])
def find_by_year():
    data = request.get_json()
    year = data.get("year")
    
    if year:
        year = int(year)
        result = manager.find_by_year(year)
        return jsonify(result)
    else:
        return jsonify({"error": "Year is required"}), 400
    
@user_bp.route("/group_by_country", methods=['POST'])
def group_by_country():
    result = manager.group_by_country()
    return jsonify(result)

@user_bp.route("/get_release_years", methods=['POST'])
def get_release_years():
    result = manager.get_release_years()
    return jsonify(result)