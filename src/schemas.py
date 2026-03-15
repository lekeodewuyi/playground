"""
Marshmallow schemas for data validation in the Task Management System
"""

from marshmallow import Schema, fields, validate, post_load
from src.models import UserRole

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    email = fields.Email(required=True)
    name = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
    role = fields.Enum(UserRole, dump_only=True)
    avatar_url = fields.Str()
    is_active = fields.Bool(dump_only=True)
    created_at = fields.DateTime(dump_only=True)

class ProjectSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str()
    color = fields.Str()
    owner_id = fields.Int(required=True)
    is_archived = fields.Bool(dump_only=True)
    created_at = fields.DateTime(dump_only=True)

class TaskSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    description = fields.Str()
    status = fields.Enum('TO_DO', 'IN_PROGRESS', 'BLOCKED', 'IN_REVIEW', 'DONE', dump_only=True)
    priority = fields.Enum('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', dump_only=True)
    due_date = fields.DateTime()
    project_id = fields.Int(required=True)
    creator_id = fields.Int(dump_only=True)
    assignee_id = fields.Int()
    is_deleted = fields.Bool(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class CommentSchema(Schema):
    id = fields.Int(dump_only=True)
    task_id = fields.Int(required=True)
    author_id = fields.Int(required=True)
    body = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class AttachmentSchema(Schema):
    id = fields.Int(dump_only=True)
    task_id = fields.Int(required=True)
    filename = fields.Str(required=True)
    file_url = fields.Str(required=True)
    file_size = fields.Int()
    uploaded_by = fields.Int(required=True)
    created_at = fields.DateTime(dump_only=True)

class LabelSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    color = fields.Str()
    project_id = fields.Int(required=True)

class ActivityLogSchema(Schema):
    id = fields.Int(dump_only=True)
    entity_type = fields.Str(required=True)
    entity_id = fields.Int(required=True)
    actor_id = fields.Int(required=True)
    action = fields.Str(required=True)
    metadata = fields.Str()
    created_at = fields.DateTime(dump_only=True)

class RefreshTokenSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    token_hash = fields.Str(required=True)
    expires_at = fields.DateTime(required=True)
    revoked = fields.Bool(dump_only=True)