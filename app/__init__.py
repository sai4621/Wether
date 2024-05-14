from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_session import Session

app = Flask(__name__, static_folder='static_app/dist')
app.config['ENV'] = 'development'
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'huzaifa_was_here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'filesystem'

db = SQLAlchemy(app)
# Set up CORS to explicitly allow methods and maybe headers
CORS(app, supports_credentials=True, origins="http://localhost:*")

Session(app)

# Ensure models and routes are imported after db and CORS setup
from app.models import User, UserPreference, City
from app import routes

with app.app_context():
    db.create_all()
