from flask import request, jsonify, send_from_directory, session  # Added session here
from werkzeug.security import generate_password_hash
from app import app, db
from app.models import User, UserPreference  # Ensure UserPreference is imported if used
import os


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        session['user_id'] = user.id
        session['username'] = user.username  # Store username in session
        return jsonify({"status": "success", "message": "Login successful", "username": user.username}), 200
    return jsonify({"status": "fail", "message": "Invalid username or password"}), 401

@app.route('/logout', methods=['GET'])
def logout():
    session.pop('user_id', None)
    session.pop('username', None)  # Remove username from session
    return jsonify({"status": "success", "message": "Logged out successfully"}), 200



@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    # Check if user already exists
    if User.query.filter_by(username=username).first():
        return jsonify({'status': 'fail', 'message': 'Username already taken'}), 409

    # Create new user
    try:
        new_user = User(username=username, password_hash=generate_password_hash(password))
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'Signup successful'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'fail', 'message': 'Failed to create user', 'error': str(e)}), 500

@app.route('/preferences', methods=['GET', 'POST'])
def preferences():
    user_id = request.args.get('user_id') if request.method == 'GET' else request.json['user_id']
    if request.method == 'POST':
        preference_key = request.json['preference_key']
        preference_value = request.json['preference_value']
        preference = UserPreference.query.filter_by(user_id=user_id, preference_key=preference_key).first()
        if preference:
            preference.preference_value = preference_value
        else:
            preference = UserPreference(user_id=user_id, preference_key=preference_key, preference_value=preference_value)
            db.session.add(preference)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'Preference saved.'}), 200
    else:
        preferences = UserPreference.query.filter_by(user_id=user_id).all()
        return jsonify({'preferences': {pref.preference_key: pref.preference_value for pref in preferences}}), 200

