"""
Test suite for Yash Sharma's Portfolio backend & database.
"""
import unittest
import json
import os
import database
from server import app

class PortfolioBackendTests(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        database.init_db()

    def test_database_init_and_stats(self):
        stats = database.get_all_stats()
        self.assertIn('visitors', stats)
        self.assertIn('arc_likes', stats)
        self.assertIn('project_likes', stats)

    def test_health_endpoint(self):
        response = self.app.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'HEALTHY')
        self.assertEqual(data['owner']['name'], 'Yash Sharma')

    def test_stats_endpoint(self):
        response = self.app.get('/api/stats')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertIn('visitors', data['data'])

    def test_contact_submission(self):
        payload = {
            'name': 'Tony Stark',
            'email': 'tony@starkindustries.com',
            'subject': 'Avengers Recruitment',
            'message': 'Yash, we have an opening in robotics and AI division.'
        }
        response = self.app.post('/api/contact',
                                 data=json.dumps(payload),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertIn('TK-', data['message'])

    def test_contact_validation_failure(self):
        payload = {
            'name': 'A',
            'email': 'invalid-email',
            'message': ''
        }
        response = self.app.post('/api/contact',
                                 data=json.dumps(payload),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_like_endpoint(self):
        response = self.app.post('/api/like',
                                 data=json.dumps({'type': 'arc'}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertGreater(data['likes'], 0)

if __name__ == '__main__':
    unittest.main()
