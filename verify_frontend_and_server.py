"""
Comprehensive Verification of Yash Sharma's Portfolio
Checks personal info, sections, API endpoints, and static assets.
"""
import os
import json
from server import app
import database

def run_verification():
    print("==================================================")
    print("STARTING FULL-STACK VERIFICATION FOR YASH SHARMA PORTFOLIO")
    print("==================================================")

    # 1. Check directory structure and required files
    base_dir = os.path.dirname(os.path.abspath(__file__))
    required_files = [
        'server.py',
        'database.py',
        'requirements.txt',
        'run_portfolio.bat',
        'index.html',
        'templates/index.html',
        'static/css/style.css',
        'static/js/audio.js',
        'static/js/spiderman.js',
        'static/js/ironman.js',
        'static/js/terminal.js',
        'static/js/main.js',
    ]

    for req in required_files:
        path = os.path.join(base_dir, req.replace('/', os.sep))
        assert os.path.exists(path), f"Missing file: {req}"
        size = os.path.getsize(path)
        assert size > 0, f"File {req} is empty"
        print(f"  [OK] Found {req} ({size} bytes)")

    # 2. Test Flask Client
    client = app.test_client()
    database.init_db()

    # GET /
    res = client.get('/')
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    html = res.get_data(as_text=True)

    # Check Personal details in HTML
    checks = [
        "YASH SHARMA",
        "JECRC University",
        "B.Tech",
        "shyam277007@gmail.com",
        "https://www.linkedin.com/in/yash-sharma-05a599432/",
        "https://github.com/07yashsharma",
        "Robotics",
        "Artificial Intelligence",
        "Coding",
        "STARK INDUSTRIES",
        "SPIDER-MAN",
        "ironman-preloader",
        "ironman-transition-overlay",
        "stark-terminal-modal"
    ]

    for check in checks:
        assert check in html, f"Missing personal keyword in HTML: {check}"
        print(f"  [OK] Verified personal/feature keyword: '{check}'")

    # 3. Test API endpoints
    stats_res = client.get('/api/stats')
    assert stats_res.status_code == 200
    stats_data = json.loads(stats_res.data)
    assert stats_data['success'] is True
    print("  [OK] Verified /api/stats endpoint response")

    contact_payload = {
        'name': 'Peter Parker',
        'email': 'peter.parker@dailybugle.com',
        'subject': 'Web Shooter Collaboration',
        'message': 'Yash, love your robotics and computer vision work at JECRC!'
    }
    contact_res = client.post('/api/contact', data=json.dumps(contact_payload), content_type='application/json')
    assert contact_res.status_code == 200
    contact_data = json.loads(contact_res.data)
    assert contact_data['success'] is True
    print("  [OK] Verified /api/contact transmission API")

    like_res = client.post('/api/like', data=json.dumps({'type': 'arc'}), content_type='application/json')
    assert like_res.status_code == 200
    print("  [OK] Verified /api/like Arc-Reactor overcharge API")

    health_res = client.get('/api/health')
    assert health_res.status_code == 200
    health_data = json.loads(health_res.data)
    assert health_data['owner']['email'] == 'shyam277007@gmail.com'
    print("  [OK] Verified /api/health subsystem check")

    print("==================================================")
    print("ALL VERIFICATIONS COMPLETED SUCCESSFULLY! 100% OPERATIONAL.")
    print("==================================================")

if __name__ == '__main__':
    run_verification()
