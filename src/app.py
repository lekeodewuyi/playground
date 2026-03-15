"""
Task Management System - Flask Backend
"""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_smorest import Api
from src.config import Config

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

# Initialize Flask-Smorest API
api = Api(app)

# Import models to register them with SQLAlchemy
from src.models import *

# Import and register blueprints
from src.backend.resources.auth import auth_bp

app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')

if __name__ == '__main__':
    app.run(debug=True)