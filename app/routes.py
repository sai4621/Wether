from flask import request, jsonify, session
from app import app, db
from app.models import User, UserPreference, City
from werkzeug.security import generate_password_hash, check_password_hash
import requests

OW_API_KEY = "3f59299cb03f1d4beb6bd960a3f546fd"

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        session['user_id'] = user.id
        session.modified = True
        return jsonify({
            "status": "success",
            "message": "Login successful",
            "username": user.username,
            "user_id": user.id
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
    session.pop('username', None)
    return jsonify({"status": "success", "message": "Logged out successfully"}), 200

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if User.query.filter_by(username=username).first():
        return jsonify({'status': 'fail', 'message': 'Username already taken'}), 409

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
        return jsonify({'temperatureUnit': 'metric'}), 200
    else:
        return jsonify({'temperatureUnit': preferences.temperatureUnit}), 200

@app.route('/preferences', methods=['POST'])
def set_preferences():
    if not request.json or 'user_id' not in request.json or 'temperatureUnit' not in request.json:
        return jsonify({'status': 'error', 'message': 'Missing required data'}), 400

    user_id = request.json.get('user_id')
    temperature_unit = request.json.get('temperatureUnit')
    if not isinstance(user_id, int) or temperature_unit not in ['C', 'F']:
        return jsonify({'status': 'error', 'message': 'Invalid data'}), 400

    preferences = UserPreference.query.filter_by(user_id=user_id).first()
    if preferences:
        preferences.temperatureUnit = temperature_unit
    else:
        preferences = UserPreference(user_id=user_id, temperatureUnit=temperature_unit)
        db.session.add(preferences)
    db.session.commit()

    return jsonify({'status': 'success', 'message': 'Preferences updated'}), 201

@app.route('/cities', methods=['POST'])
def add_city():
    if 'user_id' not in session:
        return jsonify({'status': 'fail', 'message': 'User not logged in'}), 403

    user_id = session['user_id']
    city_name = request.json.get('city_name')
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

def convert_temperature(temp_kelvin, unit):
    if unit == 'F':
        return (temp_kelvin - 273.15) * 9/5 + 32
    elif unit == 'C':
        return temp_kelvin - 273.15
    return temp_kelvin

@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    user_id = request.args.get('user_id')
    print(f'params passed: city: {city} {user_id}')

    user_preference = UserPreference.query.filter_by(user_id=user_id).first()
    preferred_unit = user_preference.temperatureUnit if user_preference else 'C'

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={OW_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        weather_data = response.json()
        temperature_kelvin = weather_data['main']['temp']
        temperature = convert_temperature(temperature_kelvin, preferred_unit)
        weather_data['main']['temp'] = round(temperature, 2)
        weather_data['main']['unit'] = preferred_unit
        print('weather data:', weather_data)
        return jsonify(weather_data)
    else:
        return jsonify({"status": "fail", "message": "Error fetching weather data"}), response.status_code
