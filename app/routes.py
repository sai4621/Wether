from flask import request, jsonify, send_from_directory, session  # Added session here
from werkzeug.security import generate_password_hash
from app import app, db
from app.models import User, UserPreference, City  # Ensure UserPreference is imported if used
import os

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        # Set session
        session['user_id'] = user.id
        session.modified = True  # Ensure changes are marked for saving
        # Include user_id in the response
        return jsonify({
            "status": "success", 
            "message": "Login successful", 
            "username": user.username,
            "user_id": user.id  # Send user_id to frontend
        }), 200
    return jsonify({"status": "fail", "message": "Invalid username or password"}), 401



@app.route('/check_session', methods=['GET'])
def check_session():
    if 'user_id' in session:
        return jsonify({
            'status': 'success',
            'session': {
                'user_id': session['user_id'],
                'username': session.get('username')
            }
        }), 200
    else:
        return jsonify({'status': 'fail', 'message': 'No active session found'}), 401


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

@app.route('/preferences', methods=['GET'])
def get_preferences():
    user_id = request.args.get('user_id')
    preferences = UserPreference.query.filter_by(user_id=user_id).first()
    if not preferences:
        # Return a default if no preferences are found
        return jsonify({'temperatureUnit': 'C'}), 200
    else:
        return jsonify({'temperatureUnit': preferences.temperatureUnit}), 200

@app.route('/preferences', methods=['POST'])
def set_preferences():
    # Check if the request contains JSON data and if it has the required keys
    if not request.json or 'user_id' not in request.json or 'temperatureUnit' not in request.json:
        return jsonify({'status': 'error', 'message': 'Missing required data'}), 400

    # Extract user_id and temperatureUnit from the JSON payload
    user_id = request.json.get('user_id')
    temperature_unit = request.json.get('temperatureUnit')

    # Further validation (e.g., check if user_id is valid, temperatureUnit is one of the allowed values)
    if not isinstance(user_id, int) or temperature_unit not in ['C', 'F']:
        return jsonify({'status': 'error', 'message': 'Invalid data'}), 400

    # Check if preferences for the user already exist in the database
    preferences = UserPreference.query.filter_by(user_id=user_id).first()
    if preferences:
        preferences.temperatureUnit = temperature_unit
    else:
        # Create new preferences if none exist for the user
        preferences = UserPreference(user_id=user_id, temperatureUnit=temperature_unit)
        db.session.add(preferences)
    
    # Commit changes to the database
    db.session.commit()

    return jsonify({'status': 'success', 'message': 'Preferences updated'}), 201

@app.route('/cities', methods=['POST'])
def add_city():
    if 'user_id' not in session:
        app.logger.debug('No user_id in session')
        return jsonify({'status': 'fail', 'message': 'User not logged in'}), 403

    user_id = session['user_id']
    city_name = request.json.get('city_name')
    # Proceed with adding the city
    if not city_name:
        return jsonify({'status': 'fail', 'message': 'City name is required'}), 400

    try:
        city = City(name=city_name, user_id=user_id)
        db.session.add(city)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'City added'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'fail', 'message': 'Failed to add city', 'error': str(e)}), 500

@app.route('/cities/<string:city_name>', methods=['DELETE'])
def delete_city(city_name):
    city = City.query.filter_by(name=city_name).first_or_404()
    db.session.delete(city)
    db.session.commit()
    return jsonify({'status': 'success', 'message': 'City removed'})



@app.route('/cities', methods=['GET'])
def get_cities():
    user_id = request.args.get('user_id')
    cities = City.query.filter_by(user_id=user_id).all()
    return jsonify({'cities': [city.name for city in cities]})