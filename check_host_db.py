import sqlite3
import json

db_path = 'D:\\n8n\\database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT versionId, nodes FROM workflow_entity WHERE id='MDJmNwCRbwcLvNjd';")
    row = cursor.fetchone()
    if row:
        v_id, nodes_json = row
        print(f"Host DB versionId: {v_id}")
        nodes = json.loads(nodes_json)
        for node in nodes:
            if node.get("name") == "Edit Fields":
                print("Assignments in host DB:")
                print(json.dumps(node.get("parameters", {}).get("assignments", {}).get("assignments", []), indent=2))
    else:
        print("Workflow not found in host DB.")
    conn.close()

if __name__ == '__main__':
    run()
