"""
Authentication endpoints for the Task Management System
"""

from flask import Blueprint, request, jsonify
from flask_smorest import Api, Blueprint
from marshmallow import ValidationError
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import os
from src.models import User, db
from src.schemas import UserSchema

# Create blueprint
auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# JWT configuration
JWT_SECRET = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-here')
JWT_ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 1 hour
REFRESH_TOKEN_EXPIRE_DAYS = 7     # 7 days

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        # Get request data
        data = request.get_json()
        
        # Validate input using schema
        user_schema = UserSchema()
        validated_data = user_schema.load(data)
        
        # Check if email already exists
        existing_user = User.query.filter_by(email=validated_data['email']).first()
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 409
        
        # Hash password
        password_hash = generate_password_hash(validated_data['password'])
        
        # Create new user
        new_user = User(
            email=validated_data['email'],
            name=validated_data['name'],
            password_hash=password_hash,
            role=validated_data.get('role', 'member')
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Return success response
        user_data = user_schema.dump(new_user)
        return jsonify({
            'message': 'User registered successfully',
            'user': user_data
        }), 201
        
    except ValidationError as err:
        return jsonify({'error': 'Validation error', 'details': err.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user and return JWT tokens"""
    try:
        # Get request data
        data = request.get_json()
        
        # Validate input
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password required'}), 400
        
        email = data['email']
        password = data['password']
        
        # Find user
        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check if user is active
        if not user.is_active:
            return jsonify({'error': 'Account deactivated'}), 401
        
        # Generate access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = jwt.encode({
            'user_id': user.id,
            'email': user.email,
            'role': user.role.value
        }, JWT_SECRET, algorithm=JWT_ALGORITHM)
        
        # Generate refresh token
        refresh_token_expires = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        refresh_token = jwt.encode({
            'user_id': user.id,
            'type': 'refresh'
        }, JWT_SECRET, algorithm=JWT_ALGORITHM)
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'Bearer',
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role.value
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    """Refresh access token using refresh token"""
    try:
        # Get refresh token from header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Invalid authorization header'}), 401
        
        refresh_token = auth_header.split(' ')[1]
        
        # Decode refresh token
        payload = jwt.decode(refresh_token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        
        if payload.get('type') != 'refresh':
            return jsonify({'error': 'Invalid refresh token'}), 401
        
        # Generate new access token
        user_id = payload['user_id']
        user = User.query.get(user_id)
        if not user or not user.is_active:
            return jsonify({'error': 'User not found or deactivated'}), 401
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = jwt.encode({
            'user_id': user.id,
            'email': user.email,
            'role': user.role.value
        }, JWT_SECRET, algorithm=JWT_ALGORITHM)
        
        return jsonify({
            'access_token': access_token,
            'token_type': 'Bearer'
        }), 200
        
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Refresh token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid refresh token'}), 401
    except Exception as e:
        return jsonify({'error': 'Token refresh failed', 'details': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user (invalidate refresh token)"""
    # In a real implementation, we would add the refresh token to a blocklist
    # For now, we'll just return success
    return jsonify({'message': 'Logged out successfully'}), 200

# Add routes to the blueprint
auth_bp.route('/register', methods=['POST'])(register)
auth_bp.route('/login', methods=['POST'])(login)
auth_bp.route('/refresh', methods=['POST'])(refresh)
auth_bp.route('/logout', methods=['POST'])(logout)