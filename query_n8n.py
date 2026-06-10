import sqlite3
import json

db_path = 'n8n_database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT name, nodes, connections, active, settings, id FROM workflow_entity WHERE id='MDJmNwCRbwcLvNjd';")
    row = cursor.fetchone()
    
    if row:
        name, nodes_json, connections_json, active, settings_json, w_id = row
        workflow = {
            "name": name,
            "nodes": json.loads(nodes_json) if nodes_json else [],
            "connections": json.loads(connections_json) if connections_json else {},
            "active": bool(active),
            "settings": json.loads(settings_json) if settings_json else {},
            "id": w_id
        }
        
        with open('Parent_Orchestrator_Agent_From_DB.json', 'w') as f:
            json.dump(workflow, f, indent=2)
        print("Successfully exported Parent Orchestrator Agent to Parent_Orchestrator_Agent_From_DB.json")
    else:
        print("Workflow MDJmNwCRbwcLvNjd not found.")
        
    conn.close()

if __name__ == '__main__':
    run()
