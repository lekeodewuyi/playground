"""
Database models for the Task Management System
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, Enum, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

# Association table for many-to-many relationship between tasks and labels
task_labels = Table('task_labels', Base.metadata,
    Column('task_id', Integer, ForeignKey('tasks.id')),
    Column('label_id', Integer, ForeignKey('labels.id'))
)

class UserRole(enum.Enum):
    ADMIN = "admin"
    MEMBER = "member"
    VIEWER = "viewer"

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    email = Column(String(120), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.MEMBER)
    avatar_url = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    projects = relationship('Project', back_populates='owner')
    tasks_created = relationship('Task', foreign_keys='Task.creator_id', back_populates='creator')
    tasks_assigned = relationship('Task', foreign_keys='Task.assignee_id', back_populates='assignee')

class Project(Base):
    __tablename__ = 'projects'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    color = Column(String(7))  # Hex color code
    owner_id = Column(Integer, ForeignKey('users.id'))
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    owner = relationship('User', back_populates='projects')
    tasks = relationship('Task', back_populates='project')

class TaskStatus(enum.Enum):
    TO_DO = "to_do"
    IN_PROGRESS = "in_progress"
    BLOCKED = "blocked"
    IN_REVIEW = "in_review"
    DONE = "done"

class TaskPriority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class Task(Base):
    __tablename__ = 'tasks'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    status = Column(Enum(TaskStatus), default=TaskStatus.TO_DO)
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM)
    due_date = Column(DateTime)
    project_id = Column(Integer, ForeignKey('projects.id'))
    creator_id = Column(Integer, ForeignKey('users.id'))
    assignee_id = Column(Integer, ForeignKey('users.id'))
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project = relationship('Project', back_populates='tasks')
    creator = relationship('User', foreign_keys=[creator_id], back_populates='tasks_created')
    assignee = relationship('User', foreign_keys=[assignee_id], back_populates='tasks_assigned')
    sub_tasks = relationship('SubTask', back_populates='parent_task')
    comments = relationship('Comment', back_populates='task')
    attachments = relationship('Attachment', back_populates='task')
    labels = relationship('Label', secondary=task_labels, back_populates='labels')

class SubTask(Base):
    __tablename__ = 'sub_tasks'
    
    id = Column(Integer, primary_key=True)
    parent_task_id = Column(Integer, ForeignKey('tasks.id'))
    title = Column(String(200), nullable=False)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    parent_task = relationship('Task', back_populates='sub_tasks')

class Comment(Base):
    __tablename__ = 'comments'
    
    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey('tasks.id'))
    author_id = Column(Integer, ForeignKey('users.id'))
    body = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    task = relationship('Task', back_populates='comments')
    author = relationship('User')

class Attachment(Base):
    __tablename__ = 'attachments'
    
    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey('tasks.id'))
    filename = Column(String(255), nullable=False)
    file_url = Column(String(255), nullable=False)
    file_size = Column(Integer)
    uploaded_by = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    task = relationship('Task', back_populates='attachments')
    uploader = relationship('User')

class Label(Base):
    __tablename__ = 'labels'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    color = Column(String(7))  # Hex color code
    project_id = Column(Integer, ForeignKey('projects.id'))
    
    # Relationships
    tasks = relationship('Task', secondary=task_labels, back_populates='labels')
    project = relationship('Project')

class ActivityLog(Base):
    __tablename__ = 'activity_logs'
    
    id = Column(Integer, primary_key=True)
    entity_type = Column(String(50), nullable=False)  # task, project, user
    entity_id = Column(Integer, nullable=False)
    actor_id = Column(Integer, ForeignKey('users.id'))
    action = Column(String(50), nullable=False)  # create, update, delete, status_change
    metadata = Column(Text)  # JSON data for additional info
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    actor = relationship('User')

class RefreshToken(Base):
    __tablename__ = 'refresh_tokens'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    token_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    revoked = Column(Boolean, default=False)
    
    # Relationships
    user = relationship('User')