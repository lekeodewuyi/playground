import pytest
from app import app, tasks

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_create_task(client):
    response = client.post('/tasks', json={'title': 'Test Task'})
    assert response.status_code == 201
    assert response.json['title'] == 'Test Task'
    assert response.json['completed'] == False

def test_get_tasks(client):
    response = client.get('/tasks')
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_get_task(client):
    response = client.post('/tasks', json={'title': 'Test Task'})
    task_id = response.json['id']
    response = client.get(f'/tasks/{task_id}')
    assert response.status_code == 200
    assert response.json['title'] == 'Test Task'

def test_update_task(client):
    response = client.post('/tasks', json={'title': 'Test Task'})
    task_id = response.json['id']
    response = client.put(f'/tasks/{task_id}', json={'completed': True})
    assert response.status_code == 200
    assert response.json['completed'] == True

def test_delete_task(client):
    response = client.post('/tasks', json={'title': 'Test Task'})
    task_id = response.json['id']
    response = client.delete(f'/tasks/{task_id}')
    assert response.status_code == 200
    response = client.get(f'/tasks/{task_id}')
    assert response.status_code == 404
