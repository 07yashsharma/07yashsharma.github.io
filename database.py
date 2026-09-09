"""
Database handling for Yash Sharma's Portfolio Website.
Stores contact messages, visitor telemetry, and Stark Arc-Reactor likes.
"""
import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'portfolio.db')

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Create messages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            ip_address TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create stats table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stats (
            key TEXT PRIMARY KEY,
            value INTEGER NOT NULL DEFAULT 0
        )
    ''')
    
    # Create project_likes table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS project_likes (
            project_id TEXT PRIMARY KEY,
            likes INTEGER NOT NULL DEFAULT 0
        )
    ''')
    
    # Initialize default stats if not present
    cursor.execute("INSERT OR IGNORE INTO stats (key, value) VALUES ('visitors', 108)")
    cursor.execute("INSERT OR IGNORE INTO stats (key, value) VALUES ('arc_likes', 42)")
    
    # Initialize project likes
    default_projects = [
        'stark-vision',
        'aerosense-iot',
        'web-slinger-visualizer',
        'jarvis-desktop',
        'campus-sync'
    ]
    for proj in default_projects:
        cursor.execute("INSERT OR IGNORE INTO project_likes (project_id, likes) VALUES (?, ?)", (proj, 15))
        
    conn.commit()
    conn.close()

def record_visitor():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE stats SET value = value + 1 WHERE key = 'visitors'")
    conn.commit()
    cursor.execute("SELECT value FROM stats WHERE key = 'visitors'")
    row = cursor.fetchone()
    count = row['value'] if row else 1
    conn.close()
    return count

def add_arc_like():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE stats SET value = value + 1 WHERE key = 'arc_likes'")
    conn.commit()
    cursor.execute("SELECT value FROM stats WHERE key = 'arc_likes'")
    row = cursor.fetchone()
    count = row['value'] if row else 1
    conn.close()
    return count

def add_project_like(project_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE project_likes SET likes = likes + 1 WHERE project_id = ?", (project_id,))
    if cursor.rowcount == 0:
        cursor.execute("INSERT INTO project_likes (project_id, likes) VALUES (?, 1)", (project_id,))
    conn.commit()
    cursor.execute("SELECT likes FROM project_likes WHERE project_id = ?", (project_id,))
    row = cursor.fetchone()
    count = row['likes'] if row else 1
    conn.close()
    return count

def get_all_stats():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT key, value FROM stats")
    stats = {row['key']: row['value'] for row in cursor.fetchall()}
    
    cursor.execute("SELECT project_id, likes FROM project_likes")
    proj_likes = {row['project_id']: row['likes'] for row in cursor.fetchall()}
    stats['project_likes'] = proj_likes
    
    conn.close()
    return stats

def save_message(name, email, subject, message, ip_address='127.0.0.1'):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO messages (name, email, subject, message, ip_address)
        VALUES (?, ?, ?, ?, ?)
    ''', (name.strip(), email.strip(), subject.strip() if subject else 'Portfolio Transmission', message.strip(), ip_address))
    conn.commit()
    msg_id = cursor.lastrowid
    conn.close()
    return msg_id

def get_recent_messages(limit=50):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, name, email, subject, message, timestamp
        FROM messages
        ORDER BY timestamp DESC
        LIMIT ?
    ''', (limit,))
    rows = cursor.fetchall()
    messages = [dict(row) for row in rows]
    conn.close()
    return messages

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully at", DB_PATH)
