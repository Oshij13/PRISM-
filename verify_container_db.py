import sqlite3
import json

db_path = 'n8n_database_check.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT nodes FROM workflow_entity WHERE id='MDJmNwCRbwcLvNjd';")
    row = cursor.fetchone()
    if row:
        nodes = json.loads(row[0])
        for node in nodes:
            if node.get("name") == "Edit Fields":
                assignments = node.get("parameters", {}).get("assignments", {}).get("assignments", [])
                print("Container's database assignments:")
                print(json.dumps(assignments, indent=2))
    else:
        print("Workflow MDJmNwCRbwcLvNjd not found.")
    conn.close()

if __name__ == '__main__':
    run()
