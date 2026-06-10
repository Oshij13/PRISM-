import sqlite3
import json

db_path = 'n8n_database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Fetch workflow
    cursor.execute("SELECT nodes FROM workflow_entity WHERE id='MDJmNwCRbwcLvNjd';")
    row = cursor.fetchone()
    
    if not row:
        print("Workflow MDJmNwCRbwcLvNjd not found.")
        return
        
    nodes = json.loads(row[0])
    updated = False
    
    for node in nodes:
        if node.get("name") == "Edit Fields" and node.get("type") == "n8n-nodes-base.set":
            assignments = node.get("parameters", {}).get("assignments", {}).get("assignments", [])
            for assignment in assignments:
                val = assignment.get("value", "")
                if val.startswith("{{") and not val.startswith("="):
                    old_val = val
                    assignment["value"] = "=" + val
                    print(f"Fixed assignment '{assignment.get('name')}': '{old_val}' -> '{assignment['value']}'")
                    updated = True
                    
    if updated:
        # Update row back to database
        nodes_json = json.dumps(nodes)
        cursor.execute("UPDATE workflow_entity SET nodes=? WHERE id='MDJmNwCRbwcLvNjd';", (nodes_json,))
        conn.commit()
        print("Database updated and committed successfully.")
    else:
        print("No changes were needed.")
        
    conn.close()

if __name__ == '__main__':
    run()
