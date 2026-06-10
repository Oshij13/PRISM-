import sqlite3
import json

db_path = 'D:\\n8n\\database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT name, nodes, connections, active, settings FROM workflow_entity WHERE id='MDJmNwCRbwcLvNjd';")
    row = cursor.fetchone()
    
    if row:
        name, nodes, connections, active, settings = row
        print(f"Workflow: {name}")
        print("\n--- NODES RAW ---")
        print(nodes)
        print("\n--- CONNECTIONS RAW ---")
        print(connections)
    else:
        print("Workflow MDJmNwCRbwcLvNjd not found.")
        
    conn.close()

if __name__ == '__main__':
    run()
