import unittest
import json
from app import app

class TaskManagerTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_create_task(self):
        response = self.app.post('/tasks', data=json.dumps({'title': 'Test Task', 'description': 'This is a test task'}), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertIn('id', data)
        self.assertEqual(data['title'], 'Test Task')
        self.assertEqual(data['description'], 'This is a test task')
        self.assertFalse(data['completed'])

    def test_get_tasks(self):
        response = self.app.get('/tasks')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)

    def test_get_task(self):
        response = self.app.post('/tasks', data=json.dumps({'title': 'Test Task', 'description': 'This is a test task'}), content_type='application/json')
        task_id = json.loads(response.data)['id']
        response = self.app.get(f'/tasks/{task_id}')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['id'], task_id)
        self.assertEqual(data['title'], 'Test Task')
        self.assertEqual(data['description'], 'This is a test task')
        self.assertFalse(data['completed'])

    def test_update_task(self):
        response = self.app.post('/tasks', data=json.dumps({'title': 'Test Task', 'description': 'This is a test task'}), content_type='application/json')
        task_id = json.loads(response.data)['id']
        response = self.app.put(f'/tasks/{task_id}', data=json.dumps({'title': 'Updated Task', 'completed': True}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['id'], task_id)
        self.assertEqual(data['title'], 'Updated Task')
        self.assertTrue(data['completed'])

    def test_delete_task(self):
        response = self.app.post('/tasks', data=json.dumps({'title': 'Test Task', 'description': 'This is a test task'}), content_type='application/json')
        task_id = json.loads(response.data)['id']
        response = self.app.delete(f'/tasks/{task_id}')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['result'])
        response = self.app.get(f'/tasks/{task_id}')
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()
