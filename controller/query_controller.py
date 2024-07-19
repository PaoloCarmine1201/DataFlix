from flask import request, jsonify, current_app as app
from bson.json_util import dumps
import service.query_manager as manager

@app.route("/movie/findAllMovie", methods=['POST'])
def find_all_movie():
    result = manager.find_all_movie()
    print(result)
    return app.response_class(response=dumps(result), mimetype='application/json'), 200