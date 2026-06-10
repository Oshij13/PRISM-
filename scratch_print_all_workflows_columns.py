import sqlite3

db_path = 'D:\\n8n\\database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all column names
    cursor.execute("PRAGMA table_info(workflow_entity);")
    columns = [col[1] for col in cursor.fetchall()]
    
    cursor.execute("SELECT * FROM workflow_entity;")
    rows = cursor.fetchall()
    
    print(f"Printing details for {len(rows)} workflows in host database:")
    for row in rows:
        print("\n" + "="*50)
        for name, val in zip(columns, row):
            if val is None:
                val_str = "NULL"
            elif isinstance(val, (str, bytes)) and len(str(val)) > 100:
                val_str = f"TEXT/BLOB of length {len(str(val))} (starts with: {str(val)[:80]}...)"
            else:
                val_str = str(val)
            print(f"  {name}: {val_str}")
            
    conn.close()

if __name__ == '__main__':
    run()
