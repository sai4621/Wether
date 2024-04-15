from flask import request, jsonify
from werkzeug.security import check_password_hash
from app import app, db
from app.models import User

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Login successful', 'status': 'success'})
    else:
        return jsonify({'message': 'Invalid username or password', 'status': 'fail'}), 401
