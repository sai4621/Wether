from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_session import Session

import os  # Added for environment variable access

app = Flask(__name__, static_folder='static_app/dist')

# Configure environment variables (Heroku provides these)
app.config['ENV'] = os.environ.get('FLASK_ENV', 'production')  # Defaults to production

# Set DEBUG based on environment
app.config['DEBUG'] = os.environ.get('DEBUG', False)  # Defaults to False for production

# Use a secret key from Heroku environment variable (recommended)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', os.urandom(24))  # Generate random key if not set

# Set up SQLAlchemy database URI from Heroku environment variable
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')

# Turn off SQLAlchemy modifications tracking (recommended)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Set session type for production (Heroku doesn't support filesystem)
app.config['SESSION_TYPE'] = 'redis'  # Example using Redis

db = SQLAlchemy(app)

# Set up CORS to explicitly allow methods and maybe headers
CORS(app, supports_credentials=True, origins="http://localhost:5174")  # Update with allowed origins

Session(app)

# Ensure models and routes are imported after db and CORS setup
from app.models import User, UserPreference, City
from app import routes

# Serve the built React app from the /wether-app/dist directory in production
if app.config['ENV'] == 'production':
  @app.route('/')
  def serve_app():
    return app.send_static_file('index.html')

with app.app_context():
    db.create_all()
