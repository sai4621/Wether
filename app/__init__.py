from flask import Flask, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app = Flask(__name__, static_folder='static_app/dist')
app.config['SECRET_KEY'] = 'huzaifa_was_here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

# After defining db, import the models
from app.models import User  # Ensure this import is after db is defined

# Apply database tables creation
with app.app_context():
    db.create_all()

# Now import routes
from app import routes
