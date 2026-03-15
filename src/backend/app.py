"""
Task Management System - Flask Backend
"""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)

# Configure the app
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///task_management.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

# Import models to register them with SQLAlchemy
from src.backend.models import *

# Import and register blueprints
from src.backend.resources.auth import auth_bp
from src.backend.resources.tasks import tasks_bp
from src.backend.resources.projects import projects_bp

app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
app.register_blueprint(tasks_bp, url_prefix='/api/v1/tasks')
app.register_blueprint(projects_bp, url_prefix='/api/v1/projects')

if __name__ == '__main__':
    app.run(debug=True)