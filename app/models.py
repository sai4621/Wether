from app import db

from werkzeug.security import check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
from app import db

class UserPreference(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    preference_key = db.Column(db.String(100), nullable=False)
    preference_value = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<UserPreference {self.preference_key}: {self.preference_value}>'

