import sqlite3

db_path = 'D:\\n8n\\database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("PRAGMA table_info(workflow_entity);")
    columns = cursor.fetchall()
    print("Columns in workflow_entity:")
    for col in columns:
        print(f"  Column ID: {col[0]} | Name: {col[1]} | Type: {col[2]}")
        
    # Let's inspect the values of all columns for all rows
    cursor.execute("SELECT * FROM workflow_entity LIMIT 1;")
    col_names = [col[1] for col in columns]
    row = cursor.fetchone()
    if row:
        print("\nExample Row:")
        for name, val in zip(col_names, row):
            val_str = str(val)
            print(f"  {name}: {val_str[:200]} (length: {len(val_str) if val else 0})")
            
    conn.close()

if __name__ == '__main__':
    run()
