import sqlite3
import json

db_path = 'n8n_database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT nodes FROM workflow_entity WHERE id='MDJmNwCRbwcLvNjd';")
    row = cursor.fetchone()
    if row:
        nodes_str = row[0]
        print(f"Total length of nodes JSON: {len(nodes_str)}")
        pos = 2205
        start = max(0, pos - 40)
        end = min(len(nodes_str), pos + 40)
        print("Snippet around position 2205:")
        print(f"... {repr(nodes_str[start:pos])} <-- POSITION 2205 --> {repr(nodes_str[pos:end])} ...")
        
        # Test parsing it in Python
        try:
            json.loads(nodes_str)
            print("Python parsed the database nodes JSON successfully.")
        except Exception as e:
            print("Python failed to parse:", e)
    conn.close()

if __name__ == '__main__':
    run()
