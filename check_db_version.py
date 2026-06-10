import sqlite3
import json

db_path = 'n8n_database_check.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Query workflow details
    cursor.execute("SELECT id, name, versionId, nodes FROM workflow_entity WHERE id='MDJmNwCRbwcLvNjd';")
    row = cursor.fetchone()
    
    if row:
        w_id, name, v_id, nodes_json = row
        print(f"Workflow ID: {w_id} | Name: {name} | DB versionId: {v_id}")
        nodes = json.loads(nodes_json)
        for node in nodes:
            if node.get("name") == "Edit Fields":
                print("Edit Fields assignments in DB:")
                print(json.dumps(node.get("parameters", {}).get("assignments", {}).get("assignments", []), indent=2))
    else:
        print("Workflow MDJmNwCRbwcLvNjd not found.")
        
    conn.close()

if __name__ == '__main__':
    run()
