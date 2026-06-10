import sqlite3
import json

db_path = 'D:\\n8n\\database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT nodes, connections, settings, staticData, pinData, meta FROM workflow_entity WHERE rowid = 3;")
    row = cursor.fetchone()
    
    if not row:
        print("RowID 3 not found.")
        conn.close()
        return
        
    nodes_str, conn_str, settings_str, static_str, pin_str, meta_str = row
    
    # Try parsing nodes
    try:
        nodes = json.loads(nodes_str)
        print("nodes: Valid JSON. Number of nodes:", len(nodes))
        # Let's search for "Respond to Webhook" in the nodes
        for idx, node in enumerate(nodes):
            if node.get('name') == 'Respond to Webhook':
                print(f"  Found 'Respond to Webhook' at node index {idx}")
                print("  Node details:", json.dumps(node, indent=2)[:500])
    except Exception as e:
        print("nodes failed to parse:", e)
        
    # Try parsing connections
    try:
        connections = json.loads(conn_str)
        print("connections: Valid JSON.")
    except Exception as e:
        print("connections failed to parse:", e)

    conn.close()

if __name__ == '__main__':
    run()
