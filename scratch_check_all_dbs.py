import sqlite3
import json
import os

db_paths = [
    'D:\\n8n\\database.sqlite',
    'n8n_database.sqlite',
    'n8n_database_check.sqlite'
]

def check_db(db_path):
    if not os.path.exists(db_path):
        print(f"\n=== Database {db_path} does not exist. ===")
        return
        
    print(f"\n=== Checking Database: {db_path} ===")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check tables in the database
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [t[0] for t in cursor.fetchall()]
    print(f"Tables in DB: {tables}")
    
    if 'workflow_entity' in tables:
        cursor.execute("SELECT id, name, nodes, connections, active, settings FROM workflow_entity;")
        rows = cursor.fetchall()
        print(f"Checking {len(rows)} workflows...")
        for row in rows:
            w_id, name, nodes_raw, conn_raw, active, settings_raw = row
            # Nodes
            try:
                if nodes_raw:
                    json.loads(nodes_raw)
            except Exception as e:
                print(f"  [ERROR] Workflow ID: {w_id} | Name: {name} | nodes is INVALID JSON: {e}")
                print(f"  Raw: {nodes_raw[:300]}")
            # Connections
            try:
                if conn_raw:
                    json.loads(conn_raw)
            except Exception as e:
                print(f"  [ERROR] Workflow ID: {w_id} | Name: {name} | connections is INVALID JSON: {e}")
                print(f"  Raw: {conn_raw[:300]}")
            # Settings
            try:
                if settings_raw:
                    json.loads(settings_raw)
            except Exception as e:
                print(f"  [ERROR] Workflow ID: {w_id} | Name: {name} | settings is INVALID JSON: {e}")
                print(f"  Raw: {settings_raw[:300]}")
    
    conn.close()

def run():
    for db_path in db_paths:
        check_db(db_path)

if __name__ == '__main__':
    run()
