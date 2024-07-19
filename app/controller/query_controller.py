from flask import Blueprint, jsonify
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
