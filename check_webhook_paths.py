import sqlite3
import json

db_path = 'n8n_database_check.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, name, active, nodes FROM workflow_entity;")
    rows = cursor.fetchall()
    
    print("Workflows in database:")
    for row in rows:
        w_id, name, active, nodes_json = row
        nodes = json.loads(nodes_json) if nodes_json else []
        
        # Check if contains a webhook node with path prism-brief
        has_webhook = False
        webhook_path = None
        for node in nodes:
            if node.get("type") == "n8n-nodes-base.webhook":
                has_webhook = True
                webhook_path = node.get("parameters", {}).get("path")
                
        if has_webhook:
            print(f"ID: {w_id} | Name: {name} | Active: {active} | Webhook Path: '{webhook_path}'")
            # If path matches prism-brief
            if webhook_path == 'prism-brief':
                print("  ==> MATCHES 'prism-brief'!")
                # Print Edit Fields node assignments
                for node in nodes:
                    if node.get("name") == "Edit Fields":
                        print("  Assignments:")
                        print(json.dumps(node.get("parameters", {}).get("assignments", {}).get("assignments", []), indent=2))
                        
    conn.close()

if __name__ == '__main__':
    run()
