from flask import Flask, send_from_directory, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_session import Session
import os

app = Flask(__name__, static_folder='../build', static_url_path='/')  # Adjust path if necessary
app.config['ENV'] = 'development'
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'huzaifa_was_here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'  # Replace with PostgreSQL URI for production
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'filesystem'

db = SQLAlchemy(app)
CORS(app)
Session(app)

# Ensure models and routes are imported after db and CORS setup
from app.models import User, UserPreference, City
from app import routes

with app.app_context():
    db.create_all()

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    # Send any other route to the index.html
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
