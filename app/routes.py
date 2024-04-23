<<<<<<< HEAD
from flask import request, jsonify, send_from_directory
from app import app, db   # Import the app and db instance from the __init__.py file
from app.models import User  # Import your User model
import os

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # Ensure that 'index.html' is at the correct path
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    # Implement or import the check_password method as needed
    if user and user.check_password(data['password']):
        return jsonify({"login": "successful"}), 200
    return jsonify({"login": "failed"}), 401
=======
from flask import request, jsonify, send_from_directory
from app import app, db   # Import the app and db instance from the __init__.py file
from app.models import User  # Import your User model
import os

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # Ensure that 'index.html' is at the correct path
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    # Implement or import the check_password method as needed
    if user and user.check_password(data['password']):
        return jsonify({"login": "successful"}), 200
    return jsonify({"login": "failed"}), 401
>>>>>>> dd53f4ef5dcff844e5a84fb57c8f411c848f9663
