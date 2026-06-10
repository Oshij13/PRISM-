import sqlite3
import json

db_path = 'D:\\n8n\\database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='workflow_published_version';")
    if not cursor.fetchone():
        print("Table workflow_published_version does not exist.")
        conn.close()
        return
        
    cursor.execute("SELECT * FROM workflow_published_version;")
    rows = cursor.fetchall()
    print(f"Found {len(rows)} rows in workflow_published_version.")
    
    # Get column names
    cursor.execute("PRAGMA table_info(workflow_published_version);")
    columns = [col[1] for col in cursor.fetchall()]
    
    for row in rows:
        print("\n" + "-"*40)
        for name, val in zip(columns, row):
            val_str = str(val)
            print(f"  {name}: {val_str[:150]} (len: {len(val_str) if val else 0})")
            
    conn.close()

if __name__ == '__main__':
    run()
