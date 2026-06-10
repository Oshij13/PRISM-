import sqlite3
import json

db_path = 'n8n_database_check.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT nodes FROM workflow_entity WHERE id='MDJmNwCRbwcLvNjd';")
    row = cursor.fetchone()
    
    if not row:
        print("Workflow MDJmNwCRbwcLvNjd not found.")
        return
        
    nodes = json.loads(row[0])
    updated = False
    
    mapping = {
        "company": "={{ $json.body?.companyName || $json.companyName }}",
        "person_name": "={{ $json.body?.personName || $json.personName }}",
        "role_title": "={{ $json.body?.personTitle || $json.personTitle }}",
        "meeting_type": "={{ $json.body?.meetingType || $json.meetingType }}",
        "meeting_goal": "={{ $json.body?.meetingGoal || $json.meetingGoal }}",
        "priority": "={{ $json.body?.priority || $json.priority }}"
    }
    
    for node in nodes:
        if node.get("name") == "Edit Fields" and node.get("type") == "n8n-nodes-base.set":
            assignments = node.get("parameters", {}).get("assignments", {}).get("assignments", [])
            for assignment in assignments:
                name = assignment.get("name")
                if name in mapping:
                    old_val = assignment.get("value")
                    assignment["value"] = mapping[name]
                    print(f"Updated assignment '{name}': '{old_val}' -> '{assignment['value']}'")
                    updated = True
                    
    if updated:
        nodes_json = json.dumps(nodes)
        cursor.execute("UPDATE workflow_entity SET nodes=? WHERE id='MDJmNwCRbwcLvNjd';", (nodes_json,))
        conn.commit()
        print("Database updated and committed successfully.")
    else:
        print("No changes were needed.")
        
    conn.close()

if __name__ == '__main__':
    run()
