from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_folder='static_app/dist')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'  # Use three slashes for relative path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from app import routes
