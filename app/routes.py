from flask import Blueprint, request, jsonify, session
from app import app, db
from app.models import User, UserPreference, City
from werkzeug.security import generate_password_hash, check_password_hash
import requests

OW_API_KEY = "3f59299cb03f1d4beb6bd960a3f546fd"

bp = Blueprint('main', __name__)

UNSPLASH_ACCESS_KEY = '_2z0hihM8RNRCdxzqxqlOhTcjCpSKHaX98wqRsAXVT4'
OPENWEATHER_API_KEY = '3f59299cb03f1d4beb6bd960a3f546fd' 
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

@bp.route('/getweather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    user_id = request.args.get('user_id')

    # Fetch weather data from OpenWeather API
    weather_response = requests.get(f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}")
    if weather_response.status_code != 200:
        return jsonify({"error": "Failed to fetch weather data"}), 400

    weather_data = weather_response.json()
    temp = weather_data['main']['temp']
    weather_description = weather_data['weather'][0]['description']
    weather_icon = weather_data['weather'][0]['icon']

    # Determine attire based on temperature
    if temp <= 273.15:  # 0°C
        keyword = 'winter clothing'
    elif temp > 273.15 and temp <= 288.15:  # 15°C
        keyword = 'fall clothing'
    elif temp > 288.15 and temp <= 297.15:  # 24°C
        keyword = 'spring clothing'
    else:
        keyword = 'summer clothing'

    # Fetch attire image from Unsplash API
    unsplash_response = requests.get(f"https://api.unsplash.com/search/photos?query={keyword}&client_id={UNSPLASH_ACCESS_KEY}&per_page=1")
    if unsplash_response.status_code != 200:
        return jsonify({"error": "Failed to fetch attire image"}), 400

    unsplash_data = unsplash_response.json()
    attire_image_url = unsplash_data['results'][0]['urls']['small']

    # Construct response data
    response_data = {
        'Temperature': temp,
        'WeatherText': weather_description,
        'WeatherImage': f"http://openweathermap.org/img/wn/{weather_icon}@2x.png",
        'AttireImage': attire_image_url
    }

    return jsonify(response_data)

@bp.route('/getcityweather', methods=['GET'])
def get_city_weather():
    city = request.args.get('city')
    user_id = request.args.get('user_id')

    if not city or not user_id:
        return jsonify({"error": "Missing city or user_id parameter"}), 400

    # Fetch current weather data from OpenWeatherMap API
    weather_response = requests.get(f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric")
    if weather_response.status_code != 200:
        return jsonify({"error": "Failed to fetch current weather data"}), 400

    weather_data = weather_response.json()
    current_weather = {
        "Temperature": weather_data['main']['temp'],
        "WeatherText": weather_data['weather'][0]['description'],
        "WeatherImage": f"http://openweathermap.org/img/wn/{weather_data['weather'][0]['icon']}@2x.png"
    }

    # Fetch forecast data from OpenWeatherMap API
    forecast_response = requests.get(f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={OPENWEATHER_API_KEY}&units=metric")
    if forecast_response.status_code != 200:
        return jsonify({"error": "Failed to fetch forecast data"}), 400

    forecast_data = forecast_response.json()
    forecast_list = [
        {
            "dt": item['dt'],
            "date": item['dt_txt'],
            "temperature": item['main']['temp'],
            "weatherIcon": item['weather'][0]['icon'],
            "weatherDescription": item['weather'][0]['description']
        }
        for item in forecast_data['list']
    ]

    return jsonify({
        "current_weather": current_weather,
        "forecast_data": forecast_list
    })
