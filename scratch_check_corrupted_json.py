import sqlite3
import json

db_path = 'D:\\n8n\\database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, name, nodes, connections, active, settings FROM workflow_entity;")
    rows = cursor.fetchall()
    
    print(f"Checking {len(rows)} workflows in host database...")
    for row in rows:
        w_id, name, nodes_raw, conn_raw, active, settings_raw = row
        print(f"\nWorkflow ID: {w_id} | Name: {name}")
        
        # Check nodes JSON
        try:
            if nodes_raw:
                json.loads(nodes_raw)
                print("  - nodes: Valid JSON")
            else:
                print("  - nodes: Empty")
        except Exception as e:
            print(f"  - nodes: INVALID JSON! Error: {e}")
            print(f"    Raw preview: {nodes_raw[:200] if nodes_raw else None}")
            
        # Check connections JSON
        try:
            if conn_raw:
                json.loads(conn_raw)
                print("  - connections: Valid JSON")
            else:
                print("  - connections: Empty")
        except Exception as e:
            print(f"  - connections: INVALID JSON! Error: {e}")
            print(f"    Raw preview: {conn_raw[:200] if conn_raw else None}")
            
        # Check settings JSON
        try:
            if settings_raw:
                json.loads(settings_raw)
                print("  - settings: Valid JSON")
            else:
                print("  - settings: Empty")
        except Exception as e:
            print(f"  - settings: INVALID JSON! Error: {e}")
            print(f"    Raw preview: {settings_raw[:200] if settings_raw else None}")

    conn.close()

if __name__ == '__main__':
    run()
