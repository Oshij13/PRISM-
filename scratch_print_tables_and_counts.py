import sqlite3

db_path = 'D:\\n8n\\database.sqlite'

def run():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]
    
    print("Tables and Row Counts in Host Database:")
    for table in tables:
        try:
            cursor.execute(f"SELECT COUNT(*) FROM [{table}];")
            count = cursor.fetchone()[0]
            print(f"  {table}: {count} rows")
        except Exception as e:
            print(f"  {table}: Error: {e}")
            
    conn.close()

if __name__ == '__main__':
    run()
