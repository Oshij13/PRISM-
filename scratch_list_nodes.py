import sqlite3
import json

db_path = 'D:\\n8n\\database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, nodes FROM workflow_entity;")
    rows = cursor.fetchall()
    
    for row in rows:
        w_id, w_name, nodes_json = row
        print(f"\nWorkflow: {w_name} (ID: {w_id})")
        nodes = json.loads(nodes_json) if nodes_json else []
        for i, node in enumerate(nodes):
            name = node.get("name")
            n_type = node.get("type")
            print(f"  [{i}] Node: '{name}' | Type: '{n_type}'")
            # Print parameters if the node name contains Webhook or Respond
            if "Webhook" in str(name) or "Respond" in str(name) or "Create a row" in str(name):
                print(f"      Parameters: {json.dumps(node.get('parameters', {}))}")
                
    conn.close()

if __name__ == '__main__':
    run()
