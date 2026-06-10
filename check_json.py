import sqlite3
import json

db_path = 'n8n_database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, name, nodes, connections, settings FROM workflow_entity;")
    rows = cursor.fetchall()
    
    for row in rows:
        w_id, name, nodes, connections, settings = row
        print(f"\nChecking Workflow ID: {w_id} | Name: {name}")
        
        try:
            if nodes:
                json.loads(nodes)
                print("  - nodes: VALID")
            else:
                print("  - nodes: EMPTY")
        except Exception as e:
            print(f"  - nodes: INVALID JSON! Error: {e}")
            print(f"    Raw preview: {nodes[:100]}...")
            
        try:
            if connections:
                json.loads(connections)
                print("  - connections: VALID")
            else:
                print("  - connections: EMPTY")
        except Exception as e:
            print(f"  - connections: INVALID JSON! Error: {e}")
            print(f"    Raw preview: {connections[:100]}...")
            
        try:
            if settings:
                json.loads(settings)
                print("  - settings: VALID")
            else:
                print("  - settings: EMPTY")
        except Exception as e:
            print(f"  - settings: INVALID JSON! Error: {e}")
            print(f"    Raw preview: {settings[:100]}...")
            
    conn.close()

if __name__ == '__main__':
    run()
