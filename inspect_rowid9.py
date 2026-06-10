import sqlite3
import json

db_path = 'n8n_database_check.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT ROWID, id, name, active, nodes FROM workflow_entity WHERE ROWID=9;")
    row = cursor.fetchone()
    if row:
        rowid, w_id, name, active, nodes_json = row
        print(f"ROWID: {rowid} | ID: {w_id} | Name: {name} | Active: {active}")
        print("Nodes JSON snippet:")
        print(nodes_json[:1000])
    else:
        print("ROWID 9 not found.")
        
    conn.close()

if __name__ == '__main__':
    run()
