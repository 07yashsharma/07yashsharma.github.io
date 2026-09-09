"""
Flask Backend for Yash Sharma's Portfolio Website.
Handles Marvel HUD telemetry, visitor counter, project likes, and Stark contact uplink.
"""
from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import re
from datetime import datetime
import database

app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')

# Initialize DB on boot
database.init_db()

@app.route('/')
def index():
    # Record visitor
    visitor_count = database.record_visitor()
    return render_template('index.html', visitor_count=visitor_count)

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Returns telemetry stats including visitors, likes, and system health"""
    stats = database.get_all_stats()
    stats['status'] = 'ONLINE'
    stats['protocol'] = 'STARK-PARKER-OS v4.2'
    stats['core_temp'] = '98.6% NOMINAL'
    stats['server_time'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    return jsonify({'success': True, 'data': stats})

@app.route('/api/like', methods=['POST'])
def add_like():
    """Handles Arc-Reactor or project like triggers"""
    data = request.get_json() or {}
    like_type = data.get('type', 'arc')
    
    if like_type == 'arc':
        new_count = database.add_arc_like()
        return jsonify({'success': True, 'type': 'arc', 'likes': new_count})
    elif like_type == 'project':
        project_id = data.get('project_id')
        if not project_id:
            return jsonify({'success': False, 'error': 'Missing project_id'}), 400
        new_count = database.add_project_like(project_id)
        return jsonify({'success': True, 'type': 'project', 'project_id': project_id, 'likes': new_count})
    else:
        return jsonify({'success': False, 'error': 'Invalid like type'}), 400

@app.route('/api/contact', methods=['POST'])
def contact():
    """Processes contact transmission from the Stark Uplink"""
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    subject = data.get('subject', 'Portfolio Uplink').strip()
    message = data.get('message', '').strip()
    
    # Validation
    if not name or len(name) < 2:
        return jsonify({'success': False, 'error': 'Agent name is required (min 2 characters).'}), 400
    
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not email or not re.match(email_regex, email):
        return jsonify({'success': False, 'error': 'Valid transmission email is required.'}), 400
        
    if not message or len(message) < 5:
        return jsonify({'success': False, 'error': 'Transmission message must be at least 5 characters.'}), 400

    ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    
    msg_id = database.save_message(name, email, subject, message, ip)
    
    return jsonify({
        'success': True,
        'message': f'Transmission received by Yash Sharma. Stark Protocol Confirmation ID: #TK-{msg_id:04d}',
        'id': msg_id
    })

@app.route('/api/messages', methods=['GET'])
def get_messages():
    """Endpoint to view incoming messages"""
    messages = database.get_recent_messages()
    return jsonify({'success': True, 'count': len(messages), 'messages': messages})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'HEALTHY',
        'subsystems': {
            'arc_reactor': 'ACTIVE',
            'web_shooters': 'CHARGED',
            'jarvis_hud': 'SYNCHRONIZED',
            'database': 'CONNECTED'
        },
        'owner': {
            'name': 'Yash Sharma',
            'role': 'B.Tech Student (1st Year)',
            'college': 'JECRC University',
            'github': 'https://github.com/07yashsharma',
            'email': 'shyam277007@gmail.com'
        }
    })

if __name__ == '__main__':
    print("==================================================")
    print("  STARK INDUSTRIES / WEB-SLINGER PORTFOLIO OS")
    print("  Host: Yash Sharma | B.Tech @ JECRC University")
    print("  Running on http://127.0.0.1:5000")
    print("==================================================")
    app.run(host='0.0.0.0', port=5000, debug=True)
