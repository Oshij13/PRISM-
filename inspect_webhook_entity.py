import sqlite3
import json

db_path = 'n8n_database_check.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if webhook_entity table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [t[0] for t in cursor.fetchall()]
    
    if 'webhook_entity' in tables:
        print("Table 'webhook_entity' exists.")
        cursor.execute("PRAGMA table_info(webhook_entity);")
        cols = [c[1] for c in cursor.fetchall()]
        print("Columns:", cols)
        
        cursor.execute("SELECT * FROM webhook_entity;")
        rows = cursor.fetchall()
        print(f"Found {len(rows)} webhooks:")
        for row in rows:
            print("-" * 40)
            for col_name, val in zip(cols, row):
                print(f"  {col_name}: {repr(val)[:200]}")
    else:
        print("Table 'webhook_entity' does not exist.")
        
    conn.close()

if __name__ == '__main__':
    run()
