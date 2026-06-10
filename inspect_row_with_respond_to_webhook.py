import sqlite3
import json

db_path = 'D:\\n8n\\database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT rowid, id, name, nodes, connections, settings, staticData, pinData, meta FROM workflow_entity WHERE nodes LIKE '%Respond to Webhook%';")
    rows = cursor.fetchall()
    
    for row in rows:
        rowid, w_id, name, nodes, connections, settings, staticData, pinData, meta = row
        print(f"Rowid: {rowid} | ID: {w_id} | Name: {name}")
        print(f"Nodes (len: {len(nodes) if nodes else 0})")
        print(f"Connections (len: {len(connections) if connections else 0})")
        print(f"Settings: {settings}")
        print(f"StaticData: {staticData}")
        print(f"PinData: {pinData}")
        print(f"Meta: {meta}")
        
    conn.close()

if __name__ == '__main__':
    run()
