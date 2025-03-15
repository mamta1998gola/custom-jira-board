from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime
import json
from datetime import date, timedelta

app = Flask(__name__)
CORS(app)

# Initialize database
def init_db():
    conn = sqlite3.connect('jira_kanban.db')
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS sprints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 0,
        is_closed BOOLEAN DEFAULT 0
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        item_type TEXT NOT NULL,
        status TEXT DEFAULT 'backlog',
        sprint_id INTEGER,
        created_at TEXT NOT NULL,
        FOREIGN KEY (sprint_id) REFERENCES sprints (id)
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (item_id) REFERENCES items (id)
    )
    ''')
    
    conn.commit()
    conn.close()

# Helper function to calculate end date considering weekends
def calculate_end_date(start_date, duration=10):
    current_date = start_date
    days_added = 0
    
    while days_added < duration:
        current_date += timedelta(days=1)
        # Skip Saturday (5) and Sunday (6)
        if current_date.weekday() < 5:
            days_added += 1
            
    return current_date

# Helper function to get sprint name with increment
def get_next_sprint_name():
    conn = sqlite3.connect('jira_kanban.db')
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sprints ORDER BY id DESC LIMIT 1")
    last_sprint = cursor.fetchone()
    conn.close()
    
    if last_sprint:
        try:
            # Extract sprint number from name (assuming format "Sprint X")
            parts = last_sprint[0].split()
            if len(parts) >= 2 and parts[0] == "Sprint":
                sprint_num = int(parts[1]) + 1
                return f"Sprint {sprint_num}"
        except:
            pass
    
    return "Sprint 1"

# Routes
@app.route('/api/items', methods=['GET'])
def get_items():
    status = request.args.get('status', 'backlog')
    sprint_id = request.args.get('sprint_id')
    
    conn = sqlite3.connect('jira_kanban.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    if sprint_id:
        cursor.execute("SELECT * FROM items WHERE sprint_id = ?", (sprint_id,))
    elif status == 'backlog':
        cursor.execute("SELECT * FROM items WHERE status = 'backlog'")
    else:
        cursor.execute("SELECT * FROM items WHERE status = ?", (status,))
    
    items = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify(items)

@app.route('/api/items', methods=['POST'])
def create_item():
    data = request.json
    title = data.get('title')
    description = data.get('description', '')
    item_type = data.get('item_type')  # story, task, or bug
    
    if not title or not item_type:
        return jsonify({"error": "Title and item type are required"}), 400
    
    conn = sqlite3.connect('jira_kanban.db')
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO items (title, description, item_type, status, created_at) VALUES (?, ?, ?, 'backlog', ?)",
        (title, description, item_type, datetime.datetime.now().isoformat())
    )
    
    item_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({"id": item_id, "message": "Item created successfully"}), 201

@app.route('/api/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    conn = sqlite3.connect('jira_kanban.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM items WHERE id = ?", (item_id,))
    item = dict(cursor.fetchone() or {})
    
    if item:
        cursor.execute("SELECT * FROM comments WHERE item_id = ? ORDER BY created_at", (item_id,))
        comments = [dict(row) for row in cursor.fetchall()]
        item['comments'] = comments
    
    conn.close()
    
    if not item:
        return jsonify({"error": "Item not found"}), 404
    
    return jsonify(item)

@app.route('/api/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    data = request.json
    
    conn = sqlite3.connect('jira_kanban.db')
    cursor = conn.cursor()
    
    update_fields = []
    values = []
    
    for field in ['title', 'description', 'status', 'sprint_id']:
        if field in data:
            update_fields.append(f"{field} = ?")
            values.append(data[field])
    
    if not update_fields:
        return jsonify({"error": "No fields to update"}), 400
    
    values.append(item_id)
    
    cursor.execute(
        f"UPDATE items SET {', '.join(update_fields)} WHERE id = ?",
        tuple(values)
    )
    
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Item updated successfully"})

@app.route('/api/comments', methods=['POST'])
def add_comment():
    data = request.json
    item_id = data.get('item_id')
    content = data.get('content')
    
    if not item_id or not content:
        return jsonify({"error": "Item ID and content are required"}), 400
    
    conn = sqlite3.connect('jira_kanban.db')
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO comments (item_id, content, created_at) VALUES (?, ?, ?)",
        (item_id, content, datetime.datetime.now().isoformat())
    )
    
    comment_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({"id": comment_id, "message": "Comment added successfully"}), 201

@app.route('/api/sprints', methods=['GET'])
def get_sprints():
    conn = sqlite3.connect('jira_kanban.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    active_only = request.args.get('active', 'false').lower() == 'true'
    
    if active_only:
        cursor.execute("SELECT * FROM sprints WHERE is_active = 1")
    else:
        cursor.execute("SELECT * FROM sprints ORDER BY id DESC")
    
    sprints = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify(sprints)

@app.route('/api/sprints', methods=['POST'])
def create_sprint():
    data = request.json
    name = data.get('name')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    
    if not name:
        name = get_next_sprint_name()
    
    if not start_date:
        start_date = date.today().isoformat()
    
    if not end_date:
        start = datetime.datetime.strptime(start_date, '%Y-%m-%d').date()
        end = calculate_end_date(start)
        end_date = end.isoformat()
    
    conn = sqlite3.connect('jira_kanban.db')
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO sprints (name, start_date, end_date, is_active) VALUES (?, ?, ?, 0)",
        (name, start_date, end_date)
    )
    
    sprint_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({
        "id": sprint_id, 
        "name": name, 
        "start_date": start_date, 
        "end_date": end_date,
        "message": "Sprint created successfully"
    }), 201

@app.route('/api/sprints/<int:sprint_id>/activate', methods=['POST'])
def activate_sprint(sprint_id):
    conn = sqlite3.connect('jira_kanban.db')
    cursor = conn.cursor()
    
    # First deactivate all sprints
    cursor.execute("UPDATE sprints SET is_active = 0")
    
    # Then activate the requested sprint
    cursor.execute("UPDATE sprints SET is_active = 1 WHERE id = ?", (sprint_id,))
    
    # Check if sprint was found and activated
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({"error": "Sprint not found"}), 404
    
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Sprint activated successfully"})

@app.route('/api/sprints/<int:sprint_id>/close', methods=['POST'])
def close_sprint(sprint_id):
    data = request.json
    move_to_sprint_id = data.get('move_to_sprint_id')
    
    conn = sqlite3.connect('jira_kanban.db')
    cursor = conn.cursor()
    
    # Get the sprint to make sure it exists
    cursor.execute("SELECT * FROM sprints WHERE id = ?", (sprint_id,))
    sprint = cursor.fetchone()
    
    if not sprint:
        conn.close()
        return jsonify({"error": "Sprint not found"}), 404
    
    # If no target sprint ID is provided, create a new sprint
    if not move_to_sprint_id:
        next_sprint_name = get_next_sprint_name()
        today = date.today()
        end_date = calculate_end_date(today)
        
        cursor.execute(
            "INSERT INTO sprints (name, start_date, end_date, is_active) VALUES (?, ?, ?, 1)",
            (next_sprint_name, today.isoformat(), end_date.isoformat())
        )
        
        move_to_sprint_id = cursor.lastrowid
    
    # Move incomplete items to the new sprint
    cursor.execute(
        "UPDATE items SET sprint_id = ? WHERE sprint_id = ? AND status IN ('To Do', 'In Progress')",
        (move_to_sprint_id, sprint_id)
    )
    
    # Mark the sprint as closed
    cursor.execute("UPDATE sprints SET is_closed = 1, is_active = 0 WHERE id = ?", (sprint_id,))
    
    # Activate the new sprint
    cursor.execute("UPDATE sprints SET is_active = 1 WHERE id = ?", (move_to_sprint_id,))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        "message": "Sprint closed successfully", 
        "new_sprint_id": move_to_sprint_id
    })

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
