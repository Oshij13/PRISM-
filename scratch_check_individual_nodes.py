import sqlite3
import json

db_path = 'D:\\n8n\\database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT nodes FROM workflow_entity WHERE id='MDJmNwCRbwcLvNjd';")
    row = cursor.fetchone()
    
    if row:
        nodes = json.loads(row[0])
        with open('nodes_inspect_utf8.json', 'w', encoding='utf-8') as f:
            json.dump(nodes, f, indent=2)
        print("Successfully written to nodes_inspect_utf8.json")
    else:
        print("Workflow not found.")
        
    conn.close()

if __name__ == '__main__':
    run()
